import { Response, Request, NextFunction } from "express";
import {
  loginUser,
  registerUser,
  findUserById,
  deleteUserById,
  findAllUsers,
} from "../models/UserModel";
import { generateVerifyToken } from "../utils/createVerifyToken";
import {sendVerificationEmail} from "../utils/email";
import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { AppError } from "../utils/appError";

const createToken = (id: string, name: string, role: Role) => {
  const secretKey = process.env.SECRET_KEY!;
  const tokenExpire = process.env.SECRET_EXP as SignOptions["expiresIn"];

  const token = jwt.sign({ userId: id, name, role }, secretKey as string, {
    expiresIn: tokenExpire,
  });
  return token;
};
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    const { token: verifgyToken, expiryDate } = await generateVerifyToken();
    const newUser = await registerUser(name, email, password,verifgyToken, expiryDate);
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verifgyToken}`;
    console.log("verificationUrl", verificationUrl);
    await sendVerificationEmail(email, verificationUrl);
    if (!newUser) next(new AppError("User registration failed", 400));
    return res.status(200).json({
      status: "success",
      message: "User registered successfully. Please verify your student email",
      User: newUser,
    });
  } catch (err) {
    next(
      new AppError(
        err.message || "there is something wrong please try again!",
        500,
      ),
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    if (!user.isActive) {
      next(new AppError("Your account is deactivated", 401));
    }
    if (!user.isVerifide) {
      next(
        new AppError("Please verify your student email before logging in", 401),
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      next(new AppError("Invalid email or password", 401));
    }
    const token = createToken(user.id, user.name, user.role);
    const { password: _, ...userWithoutPassword } = user;
    return res
      .status(200)
      .cookie("Token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60 * 1000,
      })
      .json({
        status: "success",
        message: "User logged in successfully",
        user: userWithoutPassword,
      });
  } catch (err) {
    next(
      new AppError(
        err.message || "there is something wrong please try again!",
        500,
      ),
    );
  }
};
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      next(new AppError("Unauthorized", 401));
    }
    const user = await findUserById(userId as string);
    if (!user) {
      next(new AppError("User not found", 404));
    }
    return res.status(200).json({
      status: "success",
      user: user,
    });
  } catch (err) {
    next(
      new AppError(
        err.message || "there is something wrong please try again!",
        500,
      ),
    );
  }
};
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await findAllUsers();
    res.status(200).json({
      status: "success",
      numberOfUsers: users.length,
      users,
    });
  } catch (err) {
    next(
      new AppError(
        err.message || "there is something wrong please try again!",
        500,
      ),
    );
  }
};
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    await deleteUserById(userId as string);
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    next(
      new AppError(
        err.message || "there is something wrong please try again!",
        500,
      ),
    );
  }
};
