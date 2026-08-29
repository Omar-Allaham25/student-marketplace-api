import Router from "express";
import { protect } from "../middleware/authMiddileware";
import {
  getFavorites,
  toggleFavorite,
} from "../controllers/favoriteController";

const router = Router();
router.use(protect);

router.get("/getFavorites", getFavorites);
router.post("/toggleFavorites/:listingId", toggleFavorite);

export default router;
