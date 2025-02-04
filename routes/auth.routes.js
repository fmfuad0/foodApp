import { Router } from "express"
import { loginUser, registerUser } from "../controllers/auth.controllers.js"


const authRouter = Router()

authRouter.route("/register").post(registerUser)
authRouter.route("/login").post(loginUser)
export {authRouter}