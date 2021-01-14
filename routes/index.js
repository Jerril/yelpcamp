const express = require('express'),
    passport = require('passport'),
    User = require('../models/user'),
    router = express.Router();

router.get('/', (req, res) =>{
    return res.render('landing');
});

router.get('/signup', (req, res) => {
    return res.render('signup', {page: "signup"});
});

router.post('/signup', (req, res) => {
    // register user
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if(err){
            req.flash('error', err.message);
            return res.redirect('/signup');
        }
        // login user
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to YelpCamp ' + user.username);
            return res.redirect('/campgrounds');
        });
    });
});

router.get('/login', (req, res) => {
    return res.render('login', {page: "login"});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('error', 'Logged out successfully');
    return res.redirect('/campgrounds');
});

module.exports = router;