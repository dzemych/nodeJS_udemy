const Review = require('../modelsDB/reviewModel')
const catchAsync = require('../utils/catchAsync')
const handlersFactory = require('../controllers/handlersFactory')


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
exports.getAllReviews = handlersFactory.getAll(Review)