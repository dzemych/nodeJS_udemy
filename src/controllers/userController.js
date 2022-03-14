const User = require('../modelsDB/userModel')
const handlersFactory = require('../controllers/handlersFactory')
const catchAsync = require('../utils/catchAsync')


exports.getMe = catchAsync(async (req, res, next) => {
   req.params.id = req.userId
   next()
})

exports.getAllUsers = handlersFactory.getAll(User)
exports.getUser = handlersFactory.getOne(User)
exports.deleteUser = handlersFactory.deleteOne(User)
exports.updateUser = handlersFactory.updateOne(User)
