const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user1 is required'],
      index: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user2 is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique match pair regardless of user order
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

// Pre-validate or pre-save hook to normalize user1 and user2 order
matchSchema.pre('validate', function (next) {
  if (this.user1 && this.user2) {
    const id1 = this.user1.toString();
    const id2 = this.user2.toString();
    if (id1 > id2) {
      const temp = this.user1;
      this.user1 = this.user2;
      this.user2 = temp;
    }
  }
  next();
});

// Helper static method to find or create match with normalized order
matchSchema.statics.createMatch = async function (u1Id, u2Id) {
  const [user1, user2] = [u1Id.toString(), u2Id.toString()].sort();
  // Safe upsert to prevent race conditions
  return await this.findOneAndUpdate(
    { user1, user2 },
    { $setOnInsert: { user1, user2 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports = mongoose.model('Match', matchSchema);
