const User = require('../modelsDB/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')


exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-__v')

  res.status(200).json({
    status: 'success',
    message: 'All users',
    users
  });
})

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-__v')

  if (!user) {
    return next(new AppError('User not found', 404))
  }

  res.status(200).json({
    status: 'success',
    user
  });
})

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
