import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter";
import categoryRouter from "./routes/categoryRouter";
import listingRouter from "./routes/listingRouter";
import favoriteRouter from "./routes/favoriteRoute";
import { handlerError } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/listings", listingRouter);
app.use("/api/favorites", favoriteRouter);

app.use(handlerError);

export default app;
