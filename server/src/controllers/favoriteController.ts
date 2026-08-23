import { Request, Response, NextFunction } from "express";
import {
  getUserFavorites,
  toggleFavorite as toggleFavoriteServices,
} from "../models/favoriteModel";
import { AppError } from "../utils/appError";

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const favorites = await getUserFavorites(userId);
    res.status(200).json({
      status: "success",
      results: favorites.length,
      data: { favorites },
    });
  } catch (err) {
    next(new AppError("error.message", 500));
  }
};

export const toggleFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const { listingId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await toggleFavoriteServices(listingId as string, userId);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(new AppError("error.message", 500));
  }
};
