import express from "express";
import { login, register, verifyEmail } from "../controllers/userController";
import { loginSchema, registerSchema } from "../validators/userValidator";
import { validate } from "../middleware/validation";

const router=express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/verify-email/:token", verifyEmail);
export default router;