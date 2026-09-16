import express from "express";
import cors from "cors";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth.js";

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
];

app.use(
    cors({
        origin: (origin, callback) => {
            // React Native / Postman / server-to-server
            if (!origin) {
                return callback(null, true);
            }

            // Next.js web
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Development localhost origins
            if (origin.startsWith("http://localhost:")) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

app.use(morgan("dev"));

// Better Auth must come before express.json()
app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
    });
});

export default app;