const Review = require('../modelsDB/reviewModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


exports.getAllReviews = catchAsync(async (req, res, next) => {
   
})

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body)

  res.status(201).json({
    status: 'success',
    review
  })
})