const express = require('express')
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')


const router = express.Router({ mergeParams: true })

router
   .route('/')
   .get(
      authController.protect,
      reviewController.getAllReviews
   )
   .post(
      authController.protect,
      reviewController.createReview
   )

router
   .route('/:id')
   .delete(
      authController.protect,
      reviewController.deleteReview
   )
   .get(
      authController.protect,
      reviewController.getReview
   )


module.exports = router