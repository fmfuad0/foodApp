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

const app = express();

dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Add extended: true here
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


const port = process.env.port || 3000; // Corrected to process.env.PORT
try {
    await connectDB()
        .then(() => {
            app.listen(port, () => {
                console.log(`Listening on port ${port}`);  // Using port here
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


export { app };
