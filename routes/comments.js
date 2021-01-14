const express = require('express'),
    Campground = require('../models/campgrounds'),
    Comment = require('../models/comments'),
    middlewareObj = require('../middlewares'),
    router = express.Router({mergeParams: true});

router.get('/new', middlewareObj.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            return res.redirect(`/campgrounds/${req.params.id}`);
        }
        return res.render('./comments/new', {campground: campground});
    });
});

router.post('/', middlewareObj.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            return res.redirect(`/campgrounds/${req.params.id}`);
        }else{
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                }else{
                    // add comment id
                    comment.author.id = req.user._id;
                    // add comment username
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    return res.redirect('/campgrounds/' + req.params.id);
                }
            });
        }
    });
});

router.get('/:comment_id/edit', middlewareObj.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(err){
                    console.log(err);
                }else{
                    return res.render('./comments/edit', {campground: foundCampground, comment: foundComment});
                }
            });
        }
    });
});

router.put('/:comment_id', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, newComment) => {
        if(err){
            return res.send(err);
        }
        return res.redirect('/campgrounds/' + req.params.id);
    });
});

router.delete('/:comment_id', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, newComment) => {
        if(err){
            return res.send(err);
        }
        return res.redirect('/campgrounds/' + req.params.id);
    });
});

module.exports = router;