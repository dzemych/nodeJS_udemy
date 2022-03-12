const User = require('../modelsDB/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const handlersFactory = require('../controllers/handlersFactory')


exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-__v')

  res.status(200).json({
     status: 'success',
     message: 'All users',
     results: users.length,
     users
  });
})

exports.getUser = handlersFactory.getOne(User)
exports.deleteUser = handlersFactory.deleteOne(User)
exports.updateUser = handlersFactory.updateOne(User)
