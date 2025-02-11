import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { getOrder, cancelOrder, getUserOrders, placeOrder, toggleOrderStatus, deliverOrder } from "../controllers/order.controllers.js";

const orderRouter = Router()

orderRouter.route("/c/:orderId").get(verifyJWT, getOrder)
orderRouter.route("/place/c/:resturentId").get(verifyJWT, placeOrder)
orderRouter.route("/toggle/c/:orderId/c/:status").get(verifyJWT, toggleOrderStatus)
orderRouter.route("/user-orders").get(verifyJWT, getUserOrders)
orderRouter.route("/cancel/c/:orderId").get(verifyJWT, cancelOrder)
orderRouter.route("/deliver/c/:orderId").get(verifyJWT, deliverOrder)


export {
    orderRouter
}