import Router from "express";
import { protect } from "../middleware/authMiddileware";
import {
  getFavorites,
  toggleFavorite,
} from "../controllers/favoriteController";

const favoriteRouter = Router();

favoriteRouter.get("/getFavorites", protect, getFavorites);
favoriteRouter.post("/toggleFavorite/:listingId", protect, toggleFavorite);

export default favoriteRouter;
