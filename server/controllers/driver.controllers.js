import mongoose from "mongoose";
import { Driver } from "../models/driver.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Order } from "../models/order.models.js";


const assignDriver = asyncHandler(async (req, res) => {
    try {
        console.log("Assigning");
                
        const { orderId } = req.params
        const order = await Order.findById(new mongoose.Types.ObjectId(orderId))
        if (!order)
            throw new apiError(404, {}, "Order not found")
        let availableDriver = await Driver.findOne({ isAvailable: true })
        if (!availableDriver) {
            console.log("No available driver found", error);

            availableDriver = await Driver.create({
                name: "Driver",
                email: "temp@mail.com",
                phone: "0000000000",
            })
        }

        order.driver = availableDriver._id
        await order.save();
        console.log("Sending : ", order);
        return res.status(200).json(new apiResponse(200, order, "Driver assigned", ""))
    } catch (error) {
        console.log(error);
        return res.status(error.status).json(new apiError(error.status, {}, "Could not assign driver.Because " + error.message))
    }
})

export {
    assignDriver
}