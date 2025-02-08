import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { getUserDetails } from '../controllers/user.controllers.js';

const userRouter = Router()

userRouter.route("/details").get(getUserDetails)
userRouter.route("/").get()


export { userRouter };