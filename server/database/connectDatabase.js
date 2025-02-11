import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        const connectionString = process.env.connectionString;  // Ensure you get the connection string from environment variables

        if (!connectionString) {
            throw new Error(`Database connection string (connectionString) is not defined in the .env file.`);
        }

        console.log("Connecting to database...");
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('***Connected to MongoDB***');
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);  // Exit the process if DB connection fails
    }
};

export default connectDB;
