import { Router } from "express";
import { createFood, getAllFoods, updateFood, deleteFood } from "../controllers/food.controllers.js";

export const foodRouter = Router()

foodRouter.route("/create").post(createFood)
foodRouter.route("/get-foods").get(getAllFoods)
foodRouter.route("/update/c/:foodId").post(updateFood)
foodRouter.route("/delete/c/:foodId").get(deleteFood)