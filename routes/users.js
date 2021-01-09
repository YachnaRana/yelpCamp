const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register',async (req, res)=>{
    res.render('users/register')
})
router.post('/register',catchAsync(async (req, res,next)=>{
    try{
        const {username, email, password} = req.body;
        const user = new User({username,email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash('success','welcome to yelpcamp')
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
}))

router.get('/login',async (req, res)=>{
    res.render('users/login')
})
router.post('/login',passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}),async (req, res)=>{
    req.flash('success', 'Welcome Back!!!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})
router.get('/logout',(req, res)=>{
    req.logOut();
    req.flash('success', 'Logged you out!!')
    res.redirect('/campgrounds');
})

module.exports = router;