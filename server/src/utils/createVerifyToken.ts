import crypto from "crypto";

export const generateVerifyToken = async () => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiryDate = new Date(Date.now() + 24* 60 * 60 * 1000);
  return { token, expiryDate };
};
