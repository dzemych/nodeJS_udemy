const mongoose = require('mongoose')


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

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review