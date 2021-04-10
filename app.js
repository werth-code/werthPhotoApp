require('dotenv').config()

let express = require("express"),
  app = express(),
  multer = require("multer"), //is a node. js middleware for handling multipart/form-data , which is primarily used for uploading files. It is written on top of busboy for maximum efficiency
  storage = multer.memoryStorage(), //!
  upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 } }), //!
  photoRoute = express.Router(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground.js"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  port = process.env.PORT || 80;


let commentRoutes = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes = require("./routes/index")
      
mongoose
  .connect("mongodb://localhost:27017/werthPhoto", { // this part 2:00 571
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to DB!"))
  .catch((error) => console.log(error.message));


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))
app.use(flash())
app.use("/photos", photoRoute) //

// seedDB() //Seed The Database

//Passport Config
app.use(require("express-session")({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//This is middlewear to add this variable to ALL routes!
app.use( (req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next()
})

app.use(indexRoutes)
app.use("/clients", campgroundRoutes) //this allows us to add prefix to the url. DRY coding.
app.use("/clients/:id/comments", commentRoutes) //


app.listen(port, () => console.log(`App listening at http://localhost:${port}`))