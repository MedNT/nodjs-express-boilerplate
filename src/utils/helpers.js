// Common utility functions
const jwt = require('jsonwebtoken');

const generateAuthToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      type: user.type 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = {
  generateAuthToken,
};