//All of the middleware
const Campground = require("../models/campground")
const Comment = require("../models/comment")
const e = require("express")
const middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Not Found!");
        res.redirect("/clients");

      } else { 
        
        if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
          req.campground = foundCampground
          next();

      } else {
          req.flash("error", "You Don't Have Permission To Do That!");
          res.redirect("back")
      }
    }
  })
  } else res.redirect("back");
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
          req.flash("error", "You Must Log In First!");
          res.redirect("back");
      
      } else {

        if (!foundComment) {
          req.flash("error", "Item not found.");
          return res.redirect("back");
        }

        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
           next();

        } else {
          req.flash("error", "You Don't Have Permission To Do That!");
          res.redirect("back");
        }
      }
    });
  } else res.redirect("back");
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You Need To Be Logged In To Do That!")
  res.redirect("/login");
}


module.exports = middlewareObj