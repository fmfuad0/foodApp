import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { apiError } from './utils/apiError.js';
import connectDB from './database/connectDatabase.js';
import { authRouter } from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { resturentRouter } from './routes/resturent.routes.js';
import { catagoryRouter } from './routes/catagory.routes.js';
import { foodRouter } from './routes/food.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { orderRouter } from './routes/order.routes.js';
import { driverRouter } from './routes/driver.routes.js';

const app = express();
dotenv.config();

// CORS configuration to allow all origins
const corsOptions = {
    origin: '*',  // Allow all origins (consider restricting this in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,  // Don't allow credentials for now
};

// Apply CORS middleware before your routes
app.use(cors(corsOptions));  

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Handling OPTIONS requests explicitly
// app.options('*', (req, res) => {
//     console.log("Handling OPTIONS request");
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'Access-Control-Allow-Methods');
//     res.sendStatus(200);  // Respond with 200 OK for OPTIONS requests
// });

const port = process.env.port || 3000;
try {
    await connectDB()
        .then(() => {
            app.listen(port, () => {
                console.log(`Listening on port ${port}`);
            });
        })
} catch (error) {
    throw new apiError(500, "Connection failed", error.message);
}

app.get("/", (req, res) => {
    res.send("User entry point");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/resturents", resturentRouter);
app.use("/api/v1/catagories", catagoryRouter);
app.use("/api/v1/foods", foodRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/driver", driverRouter);

export { app };
