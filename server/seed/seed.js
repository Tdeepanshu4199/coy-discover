require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const { demoUser, mockProfiles, incomingLikersIndices } = require('./seedData');

const seedDatabase = async () => {
  try {
    console.log('🌱 [Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('🧹 [Seed] Cleaning existing test collections...');
    await User.deleteMany({});
    await Swipe.deleteMany({});
    await Match.deleteMany({});

    console.log('👤 [Seed] Seeding fixed demo user...');
    const createdDemoUser = await User.create(demoUser);
    console.log(`   ✓ Demo User created: ${createdDemoUser.name} (ID: ${createdDemoUser._id})`);

    console.log('👥 [Seed] Seeding 32 realistic mock user profiles...');
    const createdMockProfiles = await User.insertMany(mockProfiles);
    console.log(`   ✓ Successfully seeded ${createdMockProfiles.length} mock profiles.`);

    console.log('💌 [Seed] Seeding incoming likes to the demo user...');
    // Seed incoming likes from selected mock profiles to the demo user
    // Note: Privacy rule - these swipes are stored in MongoDB as incoming likes (fromUser: mockUser, toUser: demoUser)
    // and will NEVER be revealed in /feed or any API until the demo user reciprocates.
    const incomingLikes = [];
    for (const idx of incomingLikersIndices) {
      if (createdMockProfiles[idx]) {
        incomingLikes.push({
          fromUser: createdMockProfiles[idx]._id,
          toUser: createdDemoUser._id,
          action: 'like',
        });
      }
    }

    await Swipe.insertMany(incomingLikes);
    console.log(`   ✓ Successfully seeded ${incomingLikes.length} hidden incoming likes to Demo User.`);
    console.log('      (These will trigger mutual matches when demo user likes them back)');

    console.log('✨ [Seed] Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ [Seed] Error during seeding:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
