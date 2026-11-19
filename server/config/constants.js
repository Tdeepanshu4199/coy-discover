const mongoose = require('mongoose');

// Fixed default Demo User ObjectId
const DEFAULT_DEMO_USER_ID = '65f000000000000000000001';

const getDemoUserId = () => {
  const envId = process.env.DEMO_USER_ID;
  if (envId && mongoose.Types.ObjectId.isValid(envId)) {
    return new mongoose.Types.ObjectId(envId);
  }
  return new mongoose.Types.ObjectId(DEFAULT_DEMO_USER_ID);
};

module.exports = {
  DEFAULT_DEMO_USER_ID,
  getDemoUserId,
};
