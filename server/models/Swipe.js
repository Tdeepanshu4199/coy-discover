const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'fromUser is required'],
      index: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'toUser is required'],
      index: true,
    },
    action: {
      type: String,
      enum: {
        values: ['like', 'pass'],
        message: 'Action must be either like or pass',
      },
      required: [true, 'Swipe action is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: a user can only swipe once on any specific profile
swipeSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);
