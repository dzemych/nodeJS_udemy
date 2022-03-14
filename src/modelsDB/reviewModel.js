const mongoose = require('mongoose')
const Tour = require('./tourModel')


const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        required: [true, 'Review must be rated'],
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.ObjectId,
        ref: "User",
        required: [true, 'Review must have owner']
    },
    tour: {
        type: mongoose.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must be written for some tour']
    }
})

reviewSchema.statics.calcAvg = async function(tourId) {
   const data = await this.aggregate([
      { $match: { tour: tourId } },
      {
         $group: {
            _id: '$tour',
            number: { $sum: 1 },
            avgRating: { $avg: '$rating' }
         }
      }
   ])

   return data
}

reviewSchema.pre(/^find/, async function(next) {
   // this.populate({
   //    path: 'tour',
   //    select: 'name price'
   // }).populate({
   //    path: 'user',
   //    select: 'name'
   // })

   next()
})

reviewSchema.post('save', async function(next) {
   // Finding and calculating rating and count for tour
   const data = await this.constructor.calcAvg(this.tour)

   // Saving this updating data to the tour
   await Tour.findByIdAndUpdate(this.tour, {
      ratingsAverage: data[0].avgRating,
      ratingsQuantity: data[0].number
   })
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review