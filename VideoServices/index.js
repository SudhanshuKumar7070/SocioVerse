import "./loadEnv.js"; // MUST be first — loads .env before any other module reads process.env
import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { videoTranscoder, queueEvents } from "./Config/queue.setup.js";
import videoRoute from "./Routes/videoUpload.route.js";
import fetchVideoRoute from "./Routes/videoFetch.route.js";
import { router as videoLikeRoute } from "./Routes/videoLike.routes.js";
import { fileURLToPath } from "url";
import { connectDb } from "./Db/connect.db.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS setup matching authentication service policy
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://socio-verse-mine.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies (required for extracting accessToken cookie)
app.use(cookieParser());

// Serve static files (e.g., HLS .m3u8 or .ts files)
app.use("/Public", express.static("Public"));

// API routes
app.use("/api/v1", videoRoute);
app.use("/api/v1", fetchVideoRoute);
app.use("/api/v1", videoLikeRoute);

// Test/healthcheck route
app.get("/hi", (req, res) => {
  return res.json({ data: "app is running successfully" });
});

// 404 handler for unknown routes
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    errors: err.errors || [],
  });
});

// Connect to shared MongoDB and start server if executed directly
if (process.env.NODE_ENV !== "test") {
  connectDb()
    .then(() => {
      const port = process.env.PORT || 3002;
      app.listen(port, () => {
        console.log(`✅ App is listening at port: ${port}`);
      });
    })
    .catch((err) => {
      console.error("❌ Database connection error in VideoServices:", err);
    });
}

export { app };
