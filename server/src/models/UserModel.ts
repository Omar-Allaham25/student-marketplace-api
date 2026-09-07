import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { AppError } from "../utils/appError";

const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};
export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      listings: true,
    },
  });
  if (!user) {
    return null;
  }
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  verifyToken: string,
  expiryDate: Date,
) => {
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error("Email is already in use");
    }
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        verifyToken: verifyToken,
        verifyTokenExpiry: expiryDate,
      },
    });
    const {
      password: _password,
      verifyToken: _verifyToken,
      verifyTokenExpiry: _verifyTokenExpiry,
      ...userWithoutPassword
    } = newUser;
    return userWithoutPassword;
  } catch (err) {
    throw new Error(
      err.message || "there is something wrong please try again!",
    );
  }
};
export const loginUser = async (email: string, password: string) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    throw new Error(
      err.message || "there is something wrong please try again!",
    );
  }
};
export const deleteUserById = async (id: string) => {
  try {
    if (!id) {
      throw new Error("User id is required");
    }
    const deleteduser = await prisma.user.delete({ where: { id } });
    if (!deleteduser) {
      throw new Error("User not found");
    }
    return deleteduser;
  } catch (err) {
    throw new Error(
      "there is something wrong in delete user please try again!",
    );
  }
};
export const findAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isVerifide: true,
      },
    });
    if (!users) {
      throw new Error("there is no users in the database");
    }
    return users;
  } catch (err) {
    throw new Error(
      "there is something wrong in get all users please try again!",
    );
  }
};
export const saveVerificationToken = async (
  userId: string,
  verifyToken: string,
  expiryDate: Date,
) => {
  try {
    const updatedUSer=await prisma.user.update({
      where:{id:userId},
      data:{
        verifyToken:verifyToken,
        verifyTokenExpiry:expiryDate
      }
    })
  } catch (err) {
    throw new Error(
      err.message || "there is something wrong please try again!",
    );
  }
};
