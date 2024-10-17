const UserService = require('../services/userService');

// Example controller function
exports.getUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};
