const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandar = require("../utils/errorhandar");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const userModel = require("../models/userModel");

//create new order
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{

    const {
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    });

    res.status(201).json({
        success:true,
        order
    })
});

//Get single order
exports.getSingleOrder = catchAsyncErrors(async(req, res, next)=>{

    const order = await Order.findById(req.params.id).populate("user", "name email", userModel);

    if(!order){
        return next(new ErrorHandar("order not found with this id", 404))
    }
    res.status(200).json({
        success:true,
        order,
    })
})

//Get loggedin user orders
exports.myOrders = catchAsyncErrors(async(req, res, next)=>{

    const orders = await Order.find({
        user:req.user._id
    });

    res.status(200).json({
        success:true,
        orders,
    })
})

//Get all orders (admin)
exports.getAllOrders = catchAsyncErrors(async(req, res, next)=>{

    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    })
})

//Update order status (admin)
exports.updateOrder = catchAsyncErrors(async(req, res, next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandar("order not found with this id", 404))
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandar("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async (odr)=>{
        await updateStock(odr.product, odr.quantity)
    })

    order.orderStatus = req.body.status;

    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now()
    }

    await order.save({validateBeforeSave:false})

    res.status(200).json({
        success:true
    })
})

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.stock-=quantity;
    await product.save({validateBeforeSave:false})
}

////Delete order (admin)
exports.deleteOrder = catchAsyncErrors(async(req, res, next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandar("order not found with this id", 404))
    }
    await order.remove();

    res.status(200).json({
        success:true
    })
})