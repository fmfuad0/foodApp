import { Router } from "express";
import { createCatagory, getAllCatagories } from "../controllers/catagory.controllers.js";

export const catagoryRouter = Router()

catagoryRouter.route("/create").post(createCatagory)
catagoryRouter.route("/get-catagories").get(getAllCatagories)