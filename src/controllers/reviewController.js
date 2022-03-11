const Review = require('../modelsDB/reviewModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


exports.getAllReviews = catchAsync(async (req, res, next) => {
   const reviews = await Review.find({ tour: req.params.tourId })

   res.status(200).json({
      status: 'success',
      reviews
   })
})

exports.createReview = catchAsync(async (req, res, next) => {
   if (!req.body.tour) req.body.tour = req.params.tourId
   if (!req.body.user) req.body.user = req.userId

  const review = await Review.create(req.body)

  res.status(201).json({
    status: 'success',
    review
  })
})