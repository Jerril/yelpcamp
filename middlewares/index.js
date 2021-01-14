const Campground = require('../models/campgrounds'),
    Comment = require('../models/comments');

const middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                req.flash('error', err.message);
                return res.redirect('back');
            }
            if(req.user._id.equals(foundComment.author.id)){
                return next();
            }else{
                req.flash('error', 'You don\'t have permission to do that');
                return res.redirect("back");
            }
        });
    }else{
        req.flash("error", "You need to login to do that");  
        return res.redirect("back");
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err){
                req.flash('error', err.message);
                return res.redirect("back");
            }
            if(req.user._id.equals(foundCampground.author.id)){
                return next();
            }else{
                req.flash('error', 'You don\'t have permission to do that');
                return res.redirect("back");
            }
        });
    }else{
        req.flash("error", "You need to login to do that");  
        return res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to login to do that");
    return res.redirect('/login');
}

module.exports = middlewareObj;