import { db } from "../lib/prisma";

export const getRestaurantsBySlug = async (slug: string) => {
  return await db.restaurant.findUnique({  where: { slug }})
};