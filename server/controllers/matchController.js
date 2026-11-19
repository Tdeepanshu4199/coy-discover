const Match = require('../models/Match');
const User = require('../models/User');
const Swipe = require('../models/Swipe');
const { getDemoUserId } = require('../config/constants');

/**
 * GET /api/matches
 * Returns all mutual matches for the logged-in demo user.
 * Excludes one-sided likes entirely.
 */
const getMatches = async (req, res, next) => {
  try {
    const demoUserId = getDemoUserId();

    // Query matches where the demo user is either user1 or user2
    const matchDocs = await Match.find({
      $or: [{ user1: demoUserId }, { user2: demoUserId }],
    })
      .sort({ createdAt: -1 })
      .populate('user1', '_id name age photo bio city college interests')
      .populate('user2', '_id name age photo bio city college interests')
      .lean();

    // Extract the partner user profile for each mutual match
    const formattedMatches = matchDocs
      .map((m) => {
        const isUser1Demo = m.user1 && m.user1._id.toString() === demoUserId.toString();
        const partner = isUser1Demo ? m.user2 : m.user1;

        if (!partner) return null;

        return {
          matchId: m._id,
          _id: partner._id,
          name: partner.name,
          age: partner.age,
          photo: partner.photo,
          bio: partner.bio,
          city: partner.city,
          college: partner.college,
          interests: partner.interests,
          matchedAt: m.createdAt,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      count: formattedMatches.length,
      matches: formattedMatches,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/me
 * Helper endpoint returning the fixed demo user's profile details.
 */
const getDemoUser = async (req, res, next) => {
  try {
    const demoUserId = getDemoUserId();
    const user = await User.findById(demoUserId).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Demo user not found. Please run seed script.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/reset
 * Helper endpoint for testing & demonstration:
 * Clears demo user's outgoing swipes and all mutual matches,
 * while preserving mock user profiles and their incoming likes to demo user!
 */
const resetDemoState = async (req, res, next) => {
  try {
    const demoUserId = getDemoUserId();

    // Delete all swipes MADE BY the demo user (keeps incoming likes from mock users intact!)
    const swipeResult = await Swipe.deleteMany({ fromUser: demoUserId });

    // Delete all matches involving the demo user
    const matchResult = await Match.deleteMany({
      $or: [{ user1: demoUserId }, { user2: demoUserId }],
    });

    return res.status(200).json({
      success: true,
      message: 'Demo state successfully reset to initial state.',
      deletedSwipes: swipeResult.deletedCount,
      deletedMatches: matchResult.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMatches,
  getDemoUser,
  resetDemoState,
};
