import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter";
import categoryRouter from "./routes/categoryRouter";
import listingRouter from "./routes/listingRouter";
import favoriteRouter from "./routes/favoriteRoute";
import authRouter from "./routes/authRouter";
import { handlerError } from "./middleware/errorHandler";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again later",
  }),
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  }),
);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/listings", listingRouter);
app.use("/api/favorites", favoriteRouter);

app.use(handlerError);

export default app;
