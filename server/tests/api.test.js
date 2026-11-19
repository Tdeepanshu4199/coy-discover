const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const { demoUser, mockProfiles, incomingLikersIndices } = require('../seed/seedData');
const { connectDB, disconnectDB } = require('../config/db');

// Helper to make in-process HTTP requests to the Express app
const makeRequest = async (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const options = {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = http.request(options, (res) => {
        let rawData = '';
        res.on('data', (chunk) => (rawData += chunk));
        res.on('end', () => {
          server.close();
          let parsedData = null;
          try {
            parsedData = JSON.parse(rawData);
          } catch {
            parsedData = rawData;
          }
          resolve({ status: res.statusCode, body: parsedData, headers: res.headers });
        });
      });

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  });
};

test.describe('Coy Discover API & Privacy Engine Tests', () => {
  let seededProfiles = [];
  let seededDemoUser = null;

  test.before(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    await User.deleteMany({});
    await Swipe.deleteMany({});
    await Match.deleteMany({});

    seededDemoUser = await User.create(demoUser);
    seededProfiles = await User.insertMany(mockProfiles);

    // Seed incoming likes from predetermined indices to demo user
    const incomingLikes = incomingLikersIndices.map((idx) => ({
      fromUser: seededProfiles[idx]._id,
      toUser: seededDemoUser._id,
      action: 'like',
    }));
    await Swipe.insertMany(incomingLikes);
  });

  test.after(async () => {
    await disconnectDB();
    setTimeout(() => {
      process.exit(0);
    }, 100);
  });

  test('TEST 1: GET /feed returns eligible profiles excluding demo user', async () => {
    const res = await makeRequest('GET', '/api/feed');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.profiles.length, 32);

    // Verify demo user is excluded
    const hasDemo = res.body.profiles.some((p) => p._id.toString() === seededDemoUser._id.toString());
    assert.equal(hasDemo, false, 'Demo user must never appear in feed');
  });

  test('TEST 2: PRIVACY CHECK - Feed must NEVER reveal incoming like status', async () => {
    const res = await makeRequest('GET', '/api/feed');
    assert.equal(res.status, 200);

    for (const profile of res.body.profiles) {
      assert.equal(profile.hasLikedDemo, undefined, 'Private like status leaked!');
      assert.equal(profile.incomingSwipe, undefined, 'Private swipe leaked!');
      assert.equal(profile.likes, undefined, 'Private likes leaked!');
    }
  });

  test('TEST 3: Like a profile that has NOT liked demo user -> saved, no match, removed from feed', async () => {
    // Index 1 (Aarav Sharma) has NOT liked demo user
    const target = seededProfiles[1];
    const res = await makeRequest('POST', '/api/swipe', {
      targetUserId: target._id.toString(),
      action: 'like',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.isMatch, false, 'Should not match since target has not liked demo user');

    // Verify profile is now excluded from feed
    const feedRes = await makeRequest('GET', '/api/feed');
    const inFeed = feedRes.body.profiles.some((p) => p._id.toString() === target._id.toString());
    assert.equal(inFeed, false, 'Swiped profile must disappear from feed');
  });

  test('TEST 4: Pass a profile -> saved, no match, removed permanently from feed', async () => {
    // Index 3 (Kabir Malhotra)
    const target = seededProfiles[3];
    const res = await makeRequest('POST', '/api/swipe', {
      targetUserId: target._id.toString(),
      action: 'pass',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.isMatch, false);

    // Verify profile is excluded from feed
    const feedRes = await makeRequest('GET', '/api/feed');
    const inFeed = feedRes.body.profiles.some((p) => p._id.toString() === target._id.toString());
    assert.equal(inFeed, false, 'Passed profile must disappear permanently from feed');
  });

  test('TEST 5: Like a profile that HAS already liked demo user -> Mutual Match!', async () => {
    // Index 0 (Ananya Verma) has liked demo user
    const target = seededProfiles[0];
    const res = await makeRequest('POST', '/api/swipe', {
      targetUserId: target._id.toString(),
      action: 'like',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.isMatch, true, 'Mutual like must result in isMatch: true');
    assert.ok(res.body.match, 'Response should contain match details');
    assert.equal(res.body.match.user.name, target.name);

    // Verify it appears in GET /matches
    const matchesRes = await makeRequest('GET', '/api/matches');
    assert.equal(matchesRes.status, 200);
    assert.equal(matchesRes.body.matches.length, 1);
    assert.equal(matchesRes.body.matches[0].name, target.name);
  });

  test('TEST 6: Duplicate swipe rejection -> 409 Conflict', async () => {
    // Swiping again on Index 0
    const target = seededProfiles[0];
    const res = await makeRequest('POST', '/api/swipe', {
      targetUserId: target._id.toString(),
      action: 'like',
    });

    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
  });

  test('TEST 7: Swiping on self rejected -> 400 Bad Request', async () => {
    const res = await makeRequest('POST', '/api/swipe', {
      targetUserId: seededDemoUser._id.toString(),
      action: 'like',
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  test('TEST 8: Invalid action rejected -> 400 Bad Request', async () => {
    const target = seededProfiles[6];
    const res = await makeRequest('POST', '/api/swipe', {
      targetUserId: target._id.toString(),
      action: 'superlike',
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  test('TEST 9: GET /matches only returns mutual matches, NEVER unreciprocated incoming likes', async () => {
    const res = await makeRequest('GET', '/api/matches');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    // Only 1 match exists so far (Ananya)
    assert.equal(res.body.matches.length, 1);

    // Check that none of the other incoming likes (like Index 2 Rhea, Index 4 Diya) are present
    const names = res.body.matches.map((m) => m.name);
    assert.ok(!names.includes('Rhea Sen'), 'Unreciprocated incoming like must NOT appear in matches');
    assert.ok(!names.includes('Diya Kapoor'), 'Unreciprocated incoming like must NOT appear in matches');
  });

  test('TEST 10: State persistence on simulated reload (feed maintains exclusions)', async () => {
    const feedRes = await makeRequest('GET', '/api/feed');
    assert.equal(feedRes.status, 200);
    // 32 total - 3 swiped (0, 1, 3) = 29 profiles remaining
    assert.equal(feedRes.body.profiles.length, 29);
  });
});
