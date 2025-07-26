// const express=require("express");
// const router=express.Router();
// const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("../schema.js");
// const listing=require("../models/listing.js");

// const validateListing=(req,res,next)=>{
//     let{error}=listingSchema.validate(req.body);
//     //console.log(result);
//     if(error){
//         let errmsg=error.details.map((el)=>el.message).join(" ,");
//         throw new ExpressError(400,errmsg);
//     }else{
//         next();
//     }
// }
// //index route
// router.get("/", wrapAsync(async (req, res) => {
//     const alllistings = await listing.find({});
//     res.render("listings/index", { alllistings: alllistings });
// }));
// // new route
// router.get("/new",(req,res)=>{
//     res.render("listings/new.ejs");

// });
// //show route
// router.get("/:id",wrapAsync(async(req,res)=>{
//     let{id}=req.params;
//     const listing1=await listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing1});
// }));
// //update route
// router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
//     let{id}=req.params;
//     await listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }));
// //DELETE route
// router.delete("/:id",wrapAsync(async(req,res)=>{
//     let{id}=req.params;
//    let deletedlisting= await listing.findByIdAndDelete(id);
//    console.log(deletedlisting);
//    res.redirect("/listings");
   
// }));
// //update roue and edit
// router.get("/:id/edit",async(req,res)=>{
//     let{id}=req.params;
//     const listing1=await listing.findById(id);
//     res.render("listings/edit.ejs",{listing1});

// });
// //create route
// router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
//         let result=listingSchema.validate(req.body);
//         console.log(result);
//         if(result.error){
//             throw new ExpressError(400,result.error);
//         }
//         // let listing=req.body.listing;
//         // console.log(listing);
//         // if(!req.body.listing){
//         //     throw new ExpressError(400,"sent valid  data for listing");
//         // }
//         const newlisting=new listing(req.body.listing);
//         // if(!newlisting.title){
//         //     throw new ExpressError(400,"title is not found!");
//         // }
//         // if(!newlisting.description){
//         //     throw new ExpressError(400,"Description is not found!");
//         // }
//         // if(!newlisting.location){
//         //     throw new ExpressError(400,"location is not found!");
//         // }
       
//         await newlisting.save();
//         res.redirect("/listings");   
// }));
// module.exports=router;