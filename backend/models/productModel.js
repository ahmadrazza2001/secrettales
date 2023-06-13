const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true, "Please add product Description"]
    },
    price:{
        type:Number,
        required:[true, "Price cannot be empty"],
        maxLength:[8, "Price cannot exceed 8 figures"]
    },
    sPrice: {
        type:Number,
        required:[true, "Price cannot be empty"],
        maxLength:[8, "Price cannot exceed 8 figures"]
    },
    xPrice:{
        type:Number,
        required:[true, "Old Price cannot be empty"],
        maxLength:[8, "Old Price cannot exceed 8 figures"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        require:[true, "Please select product Category"]
    },
    gender:{
        type:String,
        require:[true, "Please select Gender"]
    },
    stock:{
        type:Number,
        required:[true, "Please enter product Stock"],
        maxLength:[4, "Stock number cannot exceed 4 digits"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref: "User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;