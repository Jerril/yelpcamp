const express = require('express'),
    Campground = require('../models/campgrounds'),
    middlewareObj = require('../middlewares'),
    router = express.Router();

router.get('/', (req, res) => {
    Campground.find({},(err, newlyFoundCampgrounds) => {
        if(err){
            return res.send(err);
        }else{
            return res.render('./campgrounds/index', {campgrounds: newlyFoundCampgrounds, page: "campgrounds"});
        }
    });
});

router.post('/', middlewareObj.isLoggedIn, (req, res) => {
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let campgroundData = {...req.body, author};
    Campground.create(campgroundData, (err, newlyCreatedCampground) => {
        if(err){
            console.log(err);
        }else{
            return res.redirect('/campgrounds');
        }
    });
});

router.get('/new', middlewareObj.isLoggedIn, (req, res) => {
    return res.render('./campgrounds/new');
});

router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
            return res.render('./campgrounds/show', {campground: foundCampground});
        }
    });
});

router.get('/:id/edit', middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
            return res.render('./campgrounds/edit', {campground: foundCampground});
        }
    });
});

router.put('/:id', middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body, (err, newCampground) => {
        if(err){
            return res.send(err);
        }
        return res.redirect('/campgrounds/' + req.params.id);
    });
});

router.delete('/:id', middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, newCampground) => {
        if(err){
            return res.send(err);
        }
        return res.redirect('/campgrounds');
    });
});

module.exports = router;