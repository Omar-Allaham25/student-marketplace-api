import prisma from "../lib/prisma";
import { Condition } from "@prisma/client";
import { findUserById } from "./UserModel";

export const getAll = async (
  page: number,
  limit: number,
  filters?: Record<string, any>,
) => {
  try {
    const skip = (page - 1) * limit;
    const whereClause: Record<string, any> = {};
    if (filters) {
      if (filters.search) {
        whereClause.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }
      if (filters.minPrice || filters.maxPrice) {
        whereClause.price = {};
        if (filters.minPrice) whereClause.price.gte = filters.minPrice;
        if (filters.maxPrice) whereClause.price.lte = filters.maxPrice;
      }
      if (filters.condition) whereClause.condition = filters.condition;
      if (filters.categoryId) whereClause.categoryId = filters.categoryId;
      if (filters.userId) whereClause.userId = filters.userId;
    }

    const [totalCount, listings] = await prisma.$transaction([
      prisma.listing.count({ where: whereClause }),
      prisma.listing.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          images: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip: skip,
        take: limit,
      }),
    ]);
    return {totalCount, listings};
  } catch (err) {
    throw new Error("Error fetching listings: " + err.message);
  }
};
export const getOne = async (id: string) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id } });
    return listing;
  } catch (err) {
    throw new Error("there is problem in fetch listing now !");
  }
};
export const createListing = async (
  userId: string,
  categoryId: string,
  title: string,
  description: string,
  price: number,
  condition: Condition,
  images: string[],
) => {
  try {
    const newListing = await prisma.listing.create({
      data: {
        userId,
        categoryId,
        title,
        description,
        price,
        condition,
        images: {
          create: images.map((imageUrl) => ({ url: imageUrl })),
        },
      },
      include: {
        images: true,
      },
    });
    return newListing;
  } catch (err) {
    throw new Error(
      err.message || "there is some thingwrong in adding new products",
    );
  }
};
export const modifyListing = async (
  id: string,
  userId: string,
  data: any,
  newImages?: string[],
) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id } });
    const userWantToUpdate = await findUserById(userId);
    if (!listing) throw new Error("there is no listing");
    if (userId !== listing.userId && userWantToUpdate?.role !== "admin")
      throw new Error("UNAUTHORIZED");
    return await prisma.$transaction(async (tx) => {
      if (newImages) {
        await tx.image.deleteMany({ where: { listingId: id } });
        const imageData = newImages.map((url) => ({ url, listingId: id }));
        if (imageData.length > 0) {
          await tx.image.createMany({ data: imageData });
        }
      }
      return await tx.listing.update({
        where: { id },
        data,
        include: { images: true },
      });
    });
  } catch (err) {
    throw new Error(
      err.message || "there is something wrong in editing products",
    );
  }
};
export const removeListing = async (id: string, userId: string) => {
  try {
    const userWantToDelete = await findUserById(userId);
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new Error("there is no listing");
    if (listing.userId !== userId && userWantToDelete?.role !== "admin")
      throw new Error("UNAUTHORIZED");
    return await prisma.listing.delete({ where: { id } });
  } catch (err) {
    throw new Error(
      err.message || "there is something wrong in deleting products",
    );
  }
};
