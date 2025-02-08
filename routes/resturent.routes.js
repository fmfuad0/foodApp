import { Router } from "express";
import { 
    createResturent,
    deleteResturent,
    getAllResturents,
    getResturentDetails
 } from "../controllers/resturent.controllers.js";

const resturentRouter = Router()

resturentRouter.route("/").get()
resturentRouter.route("/create").post(createResturent)
resturentRouter.route("/get-resturents").get(getAllResturents)
resturentRouter.route("/c/:resturentId").get(getResturentDetails)
resturentRouter.route("/delete/c/:resturentId").get(deleteResturent)


export {resturentRouter}