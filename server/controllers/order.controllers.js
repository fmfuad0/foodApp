import mongoose, { Schema } from "mongoose";
import { Order } from "../models/order.models.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Cart } from "../models/cart.models.js";
import { Driver } from "../models/driver.models.js";
import { error } from "console";


const getOrder = asyncHandler(async (req, res)=>{
    const {orderId} = req.params
    const order = await Order.findById(new mongoose.Types.ObjectId(orderId));
    
    if(!order)
        return res.status(404).json(new apiResponse(404, {}, "Order not found"))
    return res.status(200).json(new apiResponse(200, order, "Order fetched successfuly"))
})

const placeOrder = asyncHandler(async(req, res)=>{
    try {
        const cart = await Cart.findOne({$and:[{orderedBy:req.user._id}, {activeStatus:true}]})
        if(!cart)
            return res.status(404).json(new apiError(404, {}, "Add items to cart first"))
        console.log("Cart amount: ", cart.totalAmount);

        let availableDriver = await Driver.findOne({isAvailable:true})
        if(!availableDriver)
        {
            // return res.status(404).json(new apiError(404, {}, "No available driver found", error))
            console.log("No available driver found", error);

            availableDriver = await Driver.create({
                name: "Driver",
                email: "temp@mail.com",
                phone: "0000000000",
            })
            

        }

        const totalPrice = cart.totalAmount+100
        const createdOrder = new Order({
            cart: new mongoose.Types.ObjectId(cart._id),
            orderedBy: req.user._id,
            totalOrderPrice: totalPrice,
            driver: availableDriver._id,
        })
        // toggleDriverAvailability(req, res, availableDriver._id)
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
        const {orderId, status} = req.params
        console.log(orderId, status);
        
        const order = await Order.findByIdAndUpdate(new mongoose.Types.ObjectId(orderId), {
            $set: {"status": status
                .replace("on-the-way", "on the way")
                .replace("waiting-to-be-recieved", "waiting to be recieved")
            }
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
    const {orderStatus} = req.params
    console.log("status : ", orderStatus);
    
    try {
        const orders = await Order.find({
            $and :[{"orderedBy":req.user._id}, {"status" : orderStatus}]
        }
        )
        // const orders = await Order.find({
        //         "orderedBy":req.user._id,
        // })
        console.log(orders);
        if(!orders)
            return res.status(404).json(new apiResponse(404, {}, "No Orders found"))
        return res.status(200).json(new apiResponse(200, orders, "User orders fetched"))
    } catch (error) {
        return res.status(500).json(new apiResponse(500, {}, "Could not fetch user orders: "+error.message))
    }

})

const cancelOrder = asyncHandler(async(req, res)=>{
    try {
        const {orderId} =  req.params
        const order =await Order.findById(new mongoose.Types.ObjectId(orderId))
        if(!order || order.status==="Canceled")
            return res.status(404).json(new apiResponse(404, {}, "Order not found or Order has already been canceled"))
        order.status = "Canceled"
        await order.save()
        return res.status(200).json(new apiResponse(200, order, "Order has been canceled"))
    } catch (error) {
        return res.status(500).json(new apiResponse(500, {}, "Could not cancel order"+error.message))
    }
})

const deliverOrder = asyncHandler(async(req, res)=>{
    try {
        const {orderId} =  req.params
        const order =await Order.findById(new mongoose.Types.ObjectId(orderId))
        console.log(orderId, order);
        
        if(!order || order.status!=="waiting to be recieved")
            return res.status(404).json(new apiResponse(404, {}, "Order not found or Order has already been delevered"))

        const driver = await Driver.findById(new mongoose.Types.ObjectId(order.driver))
        console.log(driver.isAvailable);
        driver.isAvailable= (true ^ driver.isAvailable);
        console.log(driver.isAvailable);
        await driver.save()
        order.status = "Delivered"
        await order.save()
        return res.status(200).json(new apiResponse(200, order, "Order has been Delivered"))
    } catch (error) {
        return res.status(500).json(new apiResponse(500, {}, "Could not cancel order"+error.message))
    }
})

export{
    placeOrder,
    toggleOrderStatus,
    getUserOrders,
    cancelOrder,
    getOrder,
    deliverOrder
}