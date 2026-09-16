import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();

// CORS configuration
const allowedOrigin = process.env.FRONTEND_URL;
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            if (origin === allowedOrigin) {
                return callback(null, true);
            }
            if (origin.startsWith("http://localhost:")) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(morgan("dev"));

// authentication routes
app.all("/api/auth/{*splat}", toNodeHandler(auth));
app.use(express.json());

// check server health
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
    });
});

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

export default app;

