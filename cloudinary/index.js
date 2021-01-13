//cloudinary.com will store photos on their server, on their database that we can retrieve relatively easily.we can also retrieve like different sizes,thumbnails.

//set up form to accept img files.store that img data in cloud and send it to cloudinary.And then cloudinary is going to send us back some info including url.we store URLs in our Mongo database.So our database is just going to hold you URLs.

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// make new instance of CloudinaryStorage and make folder in it named YelpCamp on cloudinary server by using your cloudinary credentials
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}