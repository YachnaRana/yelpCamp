const express = require('express');
//use mergeParams to access to :id params in routes from app.js
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const {campgroundSchema, reviewSchema} = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateReview, isReviewAuthor} = require('../middleware');
const ExpressError = require('../utils/ExpressError');


router.post('/',isLoggedIn,validateReview, catchAsync(async(req, res)=>{
    const campground =await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new Review!!')
    res.redirect(`/campgrounds/${campground._id}`);
}))
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async(req, res)=>{
    const {id, reviewId} = req.params;
    // console.log(req.params)
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted Review!!')
    res.redirect(`/campgrounds/${id}`);

}))

module.exports = router;