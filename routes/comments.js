const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middleware = require("../middleware"); //Has our middleware functions
  
//Comments New 
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) console.log("Error", err);
    else res.render("comments/new", { campground: campground });
  });
});

//Comments Create
router.post("/", middleware.isLoggedIn, (req, res) => { //we add our middleware func with this
  Campground.findById(req.params.id, (err, campground) => {
    if (err) res.redirect("/clients");
    else
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something Went Wrong!");
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();

          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          req.flash("success", "Successfully Created Comment!");
          res.redirect("/clients/" + campground._id);
        }
      });
  });
});

//Comments Edit Route

router.get("/:comment_id/edit", middleware.checkCommentOwnership, ( req, res ) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err || !foundCampground) {
      req.flash("error", "Not Found!");
      return res.redirect("back")
    }
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash("error", "Comment Not Found!");
        res.redirect("back");
        } else {
          req.flash("error", "You Don't Have Permission!");
          res.render("comments/edit", {
            campground_id: req.params.id,
            comment: foundComment,
        });
      }
    });
  })
})

//Comments Update Route

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComments) => {
    if (err) res.redirect("back")
    else res.redirect("/clients/" + req.params.id)
  })
})

//Comments Destroy Route

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) res.redirect("back");
    else {
      req.flash("success", "Deleted Comment!");
      res.redirect("/clients/" + req.params.id);
    }
  });
});

module.exports = router;