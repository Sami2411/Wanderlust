if(process.env.NODE_ENV !="production"){
    require("dotenv").config();

}




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");

const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { isLoggedIn, isOwner } = require("./middleware.js");
const listingController = require("./controllers/listings.js");
const reviewController=require('./controllers/review.js')
const userRouter = require("./routes/user.js");
const multer  = require('multer')
const {storage}=require("./cloudConfig.js")
const upload = multer({ storage })


const dburl=process.env.ATLASDB_URL;


main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    //await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600

})
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err)
})

const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/", userRouter);

// ✅ Only this root route remains
app.get("/", wrapAsync(listingController.index));
app.get("/listing", wrapAsync(listingController.index));


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(" ,");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(" ,");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

// New listing form
app.get("/listings/new", isLoggedIn,listingController.renderNewForm );

// Show listing
app.get("/listings/:id", wrapAsync(listingController.showListing));

// Update listing
app.put("/listings/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));

// Delete listing
app.delete("/listings/:id", isLoggedIn, isOwner, wrapAsync(listingController.DeleteListing));

// Add review
app.post("/listings/:id/reviews", validateReview, wrapAsync(reviewController.createReview));

// Create new listing
app.post("/listings", isLoggedIn, 
    upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

// Extra fallback (can be removed if unnecessary)
app.post("/listings", async (req, res) => {
    const { title, description, image, price, location, country } = req.body.listing;
    const newlisting = new listing({ title, description, image, price, location, country });
    await newlisting.save();
    res.redirect("/");
});

// Edit listing
app.get("/listings/:id/edit", isLoggedIn, isOwner, listingController.editListing);

// 404 handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("App is listening on port 8080");
});
