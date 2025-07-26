const mongoose=require("mongoose");
const review = require("./review");
const { required } = require("joi");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
        // type:String,
        // default:"https://images.hdqwalls.com/wallpapers/mountain-scenery-morning-sun-rays-4k-kf.jpg",
        // set:(v)=>v===""
        // ?"https://images.hdqwalls.com/wallpapers/mountain-scenery-morning-sun-rays-4k-kf.jpg"
        // :v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    
});
const listing=mongoose.model("listing",listingSchema);
module.exports=listing;