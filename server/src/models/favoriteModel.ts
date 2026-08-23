import prisma from "../lib/prisma";
import { AppError } from "../utils/appError";

export const toggleFavorite = async (listingId: string, userId: string) => {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }
  const favorite = await prisma.favorite.findUnique({
    where: { userId_listingId: { userId, listingId } },
  });
  if (favorite) {
    await prisma.favorite.delete({
      where: { userId_listingId: { userId, listingId } },
    });
    return { status: "removed", message: "Listing removed from favorites" };
  } else {
    await prisma.favorite.create({
      data: {
        userId,
        listingId,
      },
    });
    return { status: "added", message: "Listing added to favorites" };
  }
};
export const getUserFavorites = async (userId: string) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { listing: true },
    orderBy:{createdAt:"desc"}
  });
  return favorites.map(fav=>fav.listing);
};
