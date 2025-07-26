const Listing = require("./models/listing"); // ✅ correct path to model

module.exports.isLoggedIn=((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
    }
    next()
})
module.exports.saveRedirecturl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let{id}=req.params;
    let listingDoc = await Listing.findById(id);
    
        if ( !listingDoc.owner.equals(res.locals.currUser._id)) {
            req.flash("error","you are not owner of listing");
            return res.redirect(`/listings/${id}`);
        }
        next();

}