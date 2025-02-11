import { Router } from "express";
import { addFoodToCart, getCart, removeFoodFromCart } from "../controllers/cart.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const cartRouter = Router()

cartRouter.route("/add/c/:foodId/c/:qty").get(verifyJWT, addFoodToCart)
cartRouter.route("/remove/c/:foodId/c/:qty").get(verifyJWT, removeFoodFromCart)
cartRouter.route("/get-cart").get(verifyJWT, getCart)

export{ cartRouter }