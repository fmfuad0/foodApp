import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { placeOrder, toggleOrderStatus } from "../controllers/order.controllers.js";

const orderRouter = Router()

orderRouter.route("/place/c/:resturentId").get(verifyJWT, placeOrder)
orderRouter.route("/toggle/c/:orderId/c/:status").get(verifyJWT, toggleOrderStatus)
orderRouter.route("/toggle/c/:orderId/c/:status").get(verifyJWT, toggleOrderStatus)


export {
    orderRouter
}