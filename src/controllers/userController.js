const UserService = require('../services/userService');
const logger = require('../utils/logger');

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await UserService.getAllUsers(page, limit);
    
    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Get users error: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users' 
    });
  }
};

module.exports = {
  getAllUsers
};