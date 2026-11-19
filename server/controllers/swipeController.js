const mongoose = require('mongoose');
const User = require('../models/User');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const { getDemoUserId } = require('../config/constants');

/**
 * POST /api/swipe
 * Record a Like or Pass swipe and determine whether it triggers a mutual match.
 *
 * Privacy Principle:
 * User A is never notified of User B's like UNLESS User A also likes User B.
 * If User B has liked User A, but User A passes, no match is made and User A
 * is never told User B liked them.
 */
const recordSwipe = async (req, res, next) => {
  try {
    const demoUserId = getDemoUserId();
    const { targetUserId, action } = req.body;

    // 1. Validate required fields
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'targetUserId is required in request body',
      });
    }

    if (!action || !['like', 'pass'].includes(action.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be either 'like' or 'pass'",
      });
    }

    const normalizedAction = action.toLowerCase();

    // 2. Validate targetUserId format
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid targetUserId format',
      });
    }

    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);

    // 3. Prevent swiping on self
    if (demoUserId.equals(targetObjectId)) {
      return res.status(400).json({
        success: false,
        message: 'Users cannot swipe on their own profile',
      });
    }

    // 4. Verify target user exists
    const targetUser = await User.findById(targetObjectId).select('-__v');
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user profile not found',
      });
    }

    // 5. Prevent duplicate swipe
    const existingSwipe = await Swipe.findOne({
      fromUser: demoUserId,
      toUser: targetObjectId,
    });

    if (existingSwipe) {
      return res.status(409).json({
        success: false,
        message: 'You have already swiped on this profile',
      });
    }

    // 6. Save the new swipe record in MongoDB
    await Swipe.create({
      fromUser: demoUserId,
      toUser: targetObjectId,
      action: normalizedAction,
    });

    // 7. If action is 'pass', immediately return no match
    if (normalizedAction === 'pass') {
      return res.status(200).json({
        success: true,
        isMatch: false,
        message: 'Swipe recorded successfully',
      });
    }

    // 8. If action is 'like', check if the target user has already liked the demo user
    const reverseSwipe = await Swipe.findOne({
      fromUser: targetObjectId,
      toUser: demoUserId,
      action: 'like',
    });

    // 9. If both users have liked each other, create a mutual match
    if (reverseSwipe) {
      const matchRecord = await Match.createMatch(demoUserId, targetObjectId);

      return res.status(200).json({
        success: true,
        isMatch: true,
        match: {
          _id: matchRecord._id,
          user: {
            _id: targetUser._id,
            name: targetUser.name,
            age: targetUser.age,
            photo: targetUser.photo,
            bio: targetUser.bio,
            city: targetUser.city,
            college: targetUser.college,
            interests: targetUser.interests,
          },
        },
      });
    }

    // 10. One-sided like: recorded safely, no match created, incoming like status undisclosed
    return res.status(200).json({
      success: true,
      isMatch: false,
      message: 'Swipe recorded successfully',
    });
  } catch (error) {
    // Catch unique constraint collision gracefully if race condition occurs
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate swipe request detected',
      });
    }
    next(error);
  }
};

module.exports = {
  recordSwipe,
};
