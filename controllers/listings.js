const listing = require("../models/listing.js"); // ✅ Add this at the top
const { listingSchema, reviewSchema } = require("../schema.js");

//index route
module.exports.index=async (req, res) => {
    const alllistings = await listing.find({});
    res.render("listings/index", { alllistings });
};
module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
}
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing1 = await listing.findById(id).populate("reviews").populate("owner");
    if (!listing1) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/");
    }
    res.render("listings/show.ejs", { listing1 });
}
module.exports.createListing=async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    // if (result.error) {
    //     throw new ExpressError(400, result.error);
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    

    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success", "New listing created");
    res.redirect("/");
}
module.exports.editListing= async (req, res) => {
    let { id } = req.params;
    const listing1 = await listing.findById(id);
    res.render("listings/edit.ejs", { listing1 });
}
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing2=await listing.findByIdAndUpdate(id, req.body.listing);
    if(typeof req.file!==undefined){
    
    let url=req.file.path;
    let filename=req.file.filename;
    listing2.image={url,filename};
    await listing2.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}
module.exports.DeleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/");
}