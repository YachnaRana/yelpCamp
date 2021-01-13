const express = require('express');
//use mergeParams to access to :id params in routes from app.js
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const {campgroundSchema, reviewSchema} = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateReview, isReviewAuthor} = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const reviews = require('../controllers/reviews')


router.post('/',isLoggedIn,validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;