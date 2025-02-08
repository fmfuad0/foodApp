import mongoose, { Schema } from "mongoose";
import { Order } from "../models/order.models.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Cart } from "../models/cart.models.js";

const placeOrder = asyncHandler(async(req, res)=>{
    try {
        const {resturentId} = req.params
        const cart = await Cart.findOne({$and:[{orderedBy:req.user._id}, {activeStatus:true}, {resturent: resturentId}]})
        if(!cart)
            return res.status(404).json(new apiError(404, {}, "Add items to cart first"))
        console.log("Cart id: ", cart.totalAmount);

        // const availableDriver = await Driver.findOne({isAvailable:true})

        const totalPrice = cart.totalAmount+100
        const createdOrder = new Order({
            cart: new mongoose.Types.ObjectId(cart._id),
            orderedBy: req.user._id,
            totalOrderPrice: totalPrice,
            driver: req.user._id,
        })
        createdOrder.save({validateBeforeSave:false})
        console.log(createdOrder);
        cart.activeStatus = false
        cart.save()
        return res.status(200).json(new apiResponse(200, createdOrder, "Order placed successfully"))
    } catch (error) {
        return res.status(500).json(new apiError(500, {}, "Could not place order: "+error.message))
    }
})

const toggleOrderStatus = asyncHandler(async(req, res)=>{
    try {
        const {orderId} = req.params
        let {status} = req.params
        console.log(orderId, status);
        
        const order = await Order.findByIdAndUpdate(new mongoose.Types.ObjectId(orderId), {
            $set: {"status": status.replace("-the-", " the ")}
        }, {new:true})
        if(!order)
            return res.status(404).json(new apiError(404, {}, "Order not found"))
        console.log(order);
        
        return res.status(200).json(new apiResponse(200, order, `Order status toggled to ${status}`))
    } catch (error) {
        return res.status(500).json(new apiError(500 ,{}, "Could not toggle order status"+error.message))
    }
})

const getUserOrders = asyncHandler(async(req, res)=>{
    try {
        const orders = await Order.find({
            orderedBy:req.user._id
        })
        return res.status(200).json(200, orders, "User orders fetched")
    } catch (error) {
        
    }

})

const cancelOrder = asyncHandler(async(req, res)=>{
    try {
        const {orderId} =  req.params
        await Order.findById(new mongoose.Types.ObjectId(orderId))
        return res.status(200).json(new apiResponse(200, {}, "Order has been canceled"))
    } catch (error) {
        return res.status(500).json(new apiResponse(500, {}, "Could not cancel order"))
    }
})

export{
    placeOrder,
    toggleOrderStatus,
    cancelOrder
}