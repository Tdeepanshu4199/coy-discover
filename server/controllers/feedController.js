const User = require('../models/User');
const Swipe = require('../models/Swipe');
const { getDemoUserId } = require('../config/constants');

/**
 * GET /api/feed
 * Returns profiles that the logged-in demo user has not swiped on yet.
 * Excludes:
 * 1. Profiles already swiped by the demo user (both like & pass).
 * 2. The demo user's own profile.
 * PRIVACY GUARANTEE: Does NOT expose incoming likes.
 */
const getFeed = async (req, res, next) => {
  try {
    const demoUserId = getDemoUserId();

    // 1. Get all user IDs already swiped on by the demo user
    const userSwipes = await Swipe.find({ fromUser: demoUserId }).select('toUser -_id').lean();
    const swipedTargetIds = userSwipes.map((s) => s.toUser);

    // 2. Query available candidate profiles excluding swiped targets & demo user
    const excludeIds = [...swipedTargetIds, demoUserId];

    const profiles = await User.find({
      _id: { $nin: excludeIds },
    })
      .select('_id name age photo bio city college interests')
      .lean();

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeed,
};
