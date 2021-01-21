//'dotenv' package will provide credentials from .env file by accessing process.env
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


// console.log(process.env);
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const passport  = require('passport');
const localStrategy = require('passport-local');
const helmet = require('helmet');

const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')
//to avoid mongoDB injection
const mongoSanitize = require('express-mongo-sanitize');

const MongoDBStore = require('connect-mongo')(session);

// connecting mongo using mongoose
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true,useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log('Database connected');
});


const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
//to avoid mongoDB injection
app.use(mongoSanitize());


//session cookie
const secret = process.env.SECRET || 'thisshouldbeabettersecret';
//this should use mongo to save session...mongo will create new collection for session
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60    //by setting this, we are saying to the session to be updated only one time in a period of 24 hours
    
})
store.on('error', function(e){
    console.log('SESSION STORE ERROR', e)
})
app.use(session({
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now() + 1000 *60*60*24*7,
        maxAge:1000 *60*60*24*7
    }
}))

//passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/fakeUser',async (req, res)=>{
//     const user = await new User({email:'fake.person@gmail.com', username:'fake'});
//     const newUser = await User.register(user, 'fakePassword');
//     res.send(newUser);
// })

//flashing a message
app.use(flash());
app.use(helmet({contentSecurityPolicy:false}))
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
//user route
app.use('/', userRoutes);
//campgrounds route
app.use('/campgrounds', campgroundRoutes);
app.get('/', (req, res)=>{
    res.render('home')
})
//reviews route
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.all('*', (req, res, next)=>{
    next(new ExpressError('page not found yachna', 404))
})
app.use((err, req, res, next)=>{
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'oh no! Something went WRoNG'
    res.status(statusCode).render('error',{err});
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Serving on port ${port}`)
})
