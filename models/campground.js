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
const CampgroundSchema = new Schema({
    title:String,
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