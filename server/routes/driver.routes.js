import { Router } from 'express';
import { assignDriver, getAssignedOrders } from '../controllers/driver.controllers.js';

const driverRouter = Router()

driverRouter.route('/assign/c/:orderId').get((req, res, next)=>{
    console.log("Test");
    next()
}, assignDriver);
driverRouter.route('/accepted-orders/c/:driverId').get(getAssignedOrders)



export{driverRouter}