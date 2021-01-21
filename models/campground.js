const { func } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


//to get thumbnail by using cloudinary img url
const ImageSchema = new Schema({
    url:String,
    filename:String
})


//reason for using virtual is that we dont need to save it into DB or model
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

//when we cant get virtuals to be part of result object 
//mongoose does not include virtuals when u convert document to json
//to include virtuals in res.json(), we need to set toJSON schema option to {virtuals:true}
const opts = {toJSON:{virtuals:true}};


const CampgroundSchema = new Schema({
    title:String,
    //adding geocoding coordinates into database
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
//We want the path to set up an image with a source and display the image and file name in case we want a user to be able to delete a particular assets on cloud. (path and filename from req.files)
    images:[ImageSchema],
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
}, opts);

//this virtual property will include markup for that popup on every single campground we see on map

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.description.substring(0,25)}...</p>`;
});

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);