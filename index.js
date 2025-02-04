import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectDB from "./database/connectDatabase.js";
import dotenv from "dotenv";
import { apiError } from "./utils/apiError.js";  // Assuming you export `ApiError` here
import { authRouter } from "./routes/auth.routes.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Add extended: true here
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const port = process.env.PORT || 3000; // Corrected to process.env.PORT
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







// Global error handler
app.use((err, req, res, next) => {
    if (err instanceof apiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }
    // Handle other errors
    return res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
});


export { app };
