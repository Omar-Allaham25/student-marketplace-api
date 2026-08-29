import { NextFunction, Request, Response } from "express";
import {
  getAll,
  getOne,
  createListing,
  modifyListing,
  removeListing,
} from "../models/listingModel";
import { AppError } from "../utils/appError";
import { uploadImageToCloundinary } from "../models/cloudinaryModel";

export const getAllListings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, minPrice, maxPrice, condition, categoryId } = req.query;
    let filters: any = {};
    if (search) filters.search = search as string;
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (condition) filters.condition = condition as string;
    if (categoryId) filters.categoryId = categoryId as string;
    const allProducts = await getAll(filters as Record<string, any>);
    res.status(200).json({
      status: "success",
      numberOfProducts: allProducts.length,
      listings: allProducts,
    });
  } catch (err) {
    next(new AppError(err.message || "Internal server error", 500));
  }
};
export const getListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const listingId = req.params.id as string;
    if (!listingId) {
      next(new AppError("id of product is required", 400));
    }
    const listing = await getOne(listingId);
    if (!listing) {
      next(new AppError("there is no product whith this id", 404));
    }
    res.status(200).json({
      status: "success",
      data: listing,
    });
  } catch (err) {
    next(
      new AppError(
        err.message || "there is something wrong please try  later!",
        500,
      ),
    );
  }
};
export const createNewListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let { categoryId, title, description, price, condition } = req.body;
    price = Number(price);
    const userId = req.user?.userId;
    const files = req.files as Express.Multer.File[];
    const imagesUrls = await Promise.all(
      files.map((file) => uploadImageToCloundinary(file.buffer)),
    );
    const newListing = await createListing(
      userId as string,
      categoryId,
      title,
      description,
      price,
      condition,
      imagesUrls,
    );
    res.status(201).json({
      status: "success",
      data: newListing,
    });
  } catch (err) {
    next(
      new AppError(
        err.message || "there is something wrong in server side ",
        500,
      ),
    );
  }
};
export const updateListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let {
      listingId,
      title,
      description,
      price,
      condition,
      status,
      categoryId,
    } = req.body;
    if (price !== undefined) price = Number(price);
    const userId = req.user?.userId as string;
    const files = req.files as Express.Multer.File[];
    const imagesUrls = await Promise.all(
      files.map((file) => uploadImageToCloundinary(file.buffer)),
    );
    const data = { title, description, price, condition, status, categoryId };
    const imagedata = imagesUrls.length > 0 ? imagesUrls : undefined;
    const updatedListing = await modifyListing(
      listingId,
      userId,
      data,
      imagedata,
    );
    res.status(200).json({
      status: "success",
      message: "product updated succesfully",
      data: updatedListing,
    });
  } catch (err) {
    return next(new AppError(err.message || "Internal Error", 500));
  }
};
export const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const listingId = req.params.id;
    const userId = req.user?.userId as string;
    if (!listingId) {
      return res.status(400).json({
        status: "fail",
        message: "id of listing you want delete is missing",
      });
    }
    await removeListing(listingId as string, userId);
    res.status(200).json({
      status: "success",
      message: "product deleted succesfully",
    });
  } catch (err) {
    return next(
      new AppError(err.message || "there is problem from server", 500),
    );
  }
};
export const getListingsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      next(new AppError("userId is required", 400));
    }
    const filters = { userId };
    const listings = await getAll(filters);
    res.status(200).json({
      status: "success",
      numberOfListings: listings.length,
      listings,
    });
  } catch (err) {
    next(
      new AppError(err.message || "there is something wrong in server", 500),
    );
  }
};
