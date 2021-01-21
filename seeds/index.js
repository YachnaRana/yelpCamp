const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log('Database connected');
});
const sample = arr=> arr[Math.floor(Math.random() * arr.length)];
const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0; i<400; i++){
        const price = Math.floor(Math.random() * 20) + 10;
        const random100 = Math.floor(Math.random() * 100);
        const camp = new Campground({
            author: '5ff662a5d05e23b182866230',
            location: `${cities[random100].city}, ${cities[random100].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro et suscipit quia, quaerat at debitis quos nihil tempore repudiandae similique enim, consectetur, numquam omnis. Vero ullam maiores totam excepturi dolor?',
            price,
            geometry:{
                type:"Point",
                coordinates:[ cities[random100].longitude, cities[random100].latitude ]
            },
        //make new campground on page, console.log that campground and get img array. print that here
            images:[
                {
                  url: 'https://res.cloudinary.com/dko5rofd4/image/upload/v1610569459/YelpCamp/iyim5ptunmn1fhnrypis.jpg',
                  filename: 'YelpCamp/iyim5ptunmn1fhnrypis'
                },
                {
                  url: 'https://res.cloudinary.com/dko5rofd4/image/upload/v1610569459/YelpCamp/psglgjjpvdqpsk9fhouq.jpg',
                  filename: 'YelpCamp/psglgjjpvdqpsk9fhouq'
                }
              ]  
        })
        await camp.save();
    }
    
}
seedDB().then(()=>{
    mongoose.connection.close();
});



 

