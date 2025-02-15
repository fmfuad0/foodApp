import { Router } from 'express';
import { assignDriver } from '../controllers/driver.controllers.js';

const driverRouter = Router()

driverRouter.route('/assign/c/:orderId').get((req, res, next)=>{
    console.log("Test");
    next()
}, assignDriver)


export{driverRouter}