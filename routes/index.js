const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user")

//Root Route
router.get("/", (req, res) => {
  res.render("landing");
});

//Register Form Route
router.get("/register", (req, res) => {
  res.render("register");
});

// show register form
router.get("/register", function (req, res) {
  res.render("register", { page: 'register' });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login", { page: 'login' });
});

//Sign In Logic
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        req.flash("error", err.message)
        res.redirect("back");
      } else {
      passport.authenticate("local")(req, res, () => {
        req.flash("success", "Welcome! " + user.username);
        res.redirect("/campgrounds");
      });
    }
  });
});

//Log In Form Route
router.get("/login", (req, res) => {
  res.render("login");
});

//Log In Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

//Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged Out!")
  res.redirect("/campgrounds");
});

module.exports = router;