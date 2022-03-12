const Review = require('../modelsDB/reviewModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const handlersFactory = require('../controllers/handlersFactory')



exports.getAllReviews = catchAsync(async (req, res, next) => {
   const reviews = await Review.find({ tour: req.params.tourId }).find()

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

exports.deleteReview = handlersFactory.deleteOne(Review)
exports.getReview = handlersFactory.getOne(Review)