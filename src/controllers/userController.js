const User = require('../modelsDB/userModel')
const AppError = require('../utils/appError')


exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -passChanged')

    res.status(200).json({
      status: 'success',
      message: 'All users',
      users
    });
  } catch (e) {
    next(new AppError(e.message, 404))
  }
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.createUser = async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
