const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const {campgroundSchema, reviewSchema} = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
//in order to parse multipart forms,middleware called multer is used
const multer = require('multer');
//{storage} contains new instance of CloudinaryStorage and cloudinary which contains all the credentials we've stored in .env file.
const {storage} = require('../cloudinary')
//pass storage to multer so that multer will parse the multipart form data and send it to storage in cloudinary, which will send then url of that img. 
const upload = multer({storage});


router.route('/')
    .get(catchAsync(campgrounds.index))
    //upload.array('image') used to upload img(data) array from form into cloudinary. 'image' is the same name given to 'name' attribute in input form in new.ejs
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'),(req, res)=>{
    //     console.log(req.body, req.files)
    //     res.send('it worked')
    // })
router.get('/new',isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(validateCampground,isLoggedIn,isAuthor, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))




module.exports = router;