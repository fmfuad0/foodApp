import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { getOrder, cancelOrder, getUserOrders, placeOrder, toggleOrderStatus, deliverOrder, getAvailableOrders } from "../controllers/order.controllers.js";

const orderRouter = Router()

orderRouter.route("/c/:orderId").get(verifyJWT, getOrder)
orderRouter.route("/place").get(verifyJWT, placeOrder)
orderRouter.route("/toggle/c/:orderId/c/:status").get(verifyJWT, toggleOrderStatus)
orderRouter.route("/user-orders/c/:orderStatus").get(verifyJWT, getUserOrders)
orderRouter.route("/available-orders").get(verifyJWT, getAvailableOrders)
orderRouter.route("/cancel/c/:orderId").get(verifyJWT, cancelOrder)
orderRouter.route("/deliver/c/:orderId").get(verifyJWT, deliverOrder)


export {
    orderRouter
}