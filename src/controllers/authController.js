const AuthService = require('../services/authService');
const logger = require('../utils/logger');

const register = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await AuthService.registerUser(userData);
    
    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type
      }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.loginUser(email, password);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type
        }
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await AuthService.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await AuthService.resetPassword(token, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add to module.exports
module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword
};