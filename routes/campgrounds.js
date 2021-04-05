const campground = require("../models/campground");

const express = require("express"),
      router = express.Router(),
      Campground = require("../models/campground"),
      middleware = require("../middleware")


router.get("/", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) console.log(err);
    else
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
      });
  });
});

//New Client

router.post("/", middleware.isLoggedIn, (req, res) => {
  //Client Info
  let name = req.body.name,
  address = req.body.address,
  phone = req.body.phone,
  email = req.body.email,
  about = req.body.about,
  
  //Wedding Info
  date = req.body.date,
  wedVenue = req.body.wedVenue,
  weddingAddress = req.body.wedAddress,

  //Package Info
  package = req.body.package,
  additions = req.body.additions,
  price = req.body.price,
  
  //Upload Contract & Image
  contract = req.body.wedContract,
  image = req.body.image,

  desc = req.body.description

  let author = {
    id: req.user._id,
    username: req.user.username
  }

  let newCampground = { 
    name: name, 
    address: address,
    phone: phone,
    email: email,
    about: about,

    date: date, 
    wedLocation: wedVenue,
    weddingAddress: weddingAddress,

    package: package, 
    additions: additions,
    price: price,

    contract: contract,
    image: image,   
    
    description: desc, 
    author: author
  };


  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) console.log(err);
    else {
      console.log(newlyCreated)
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new camp

router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//SHOW - id route to individual camp info - this url must be last
// as it is really /anything and we want /campgrounds etc to be specific

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground Not Found!")
        res.redirect("back")
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});


//EDIT Camp Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
      res.render("campgrounds/edit", { campground: foundCampground });
    })
})
//UPDATE Camp Route

router.put("/:id", middleware.checkCampgroundOwnership, ( req, res ) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, ( err, updatedCampground ) => {
    if(err) res.redirect("/campgrounds")
    else res.redirect("/campgrounds/" + req.params.id)
  })
})

//DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, ( req, res ) => {
  Campground.findByIdAndDelete(req.params.id, (err) => {
    if(err) res.redirect("/campgrounds");
  })
  res.redirect("/campgrounds");
})

//This also deletes comments
router.delete("/:id", async (req, res) => {
  if(req.isAuthenticated()) {
    try {
        let foundCampground = await Campground.findById(req.params.id);
        await foundCampground.remove();
        res.redirect("/campgrounds");
      } catch (error) {
        console.log(error.message);
        } 
      }
    res.redirect("/campgrounds")
});


module.exports = router