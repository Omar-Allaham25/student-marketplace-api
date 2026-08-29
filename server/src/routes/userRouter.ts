import { Router } from "express";
import {
  login,
  register,
  getMe,
  deleteUser,
  getAllUsers,
} from "../controllers/userController";
import { protect, restrictTo } from "../middleware/authMiddileware";
import { loginSchema, registerSchema } from "../validators/userValidator";
import { validate } from "../middleware/validation";

const router = Router();

router.get("/", protect, restrictTo, getAllUsers);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);
router.delete("/delete/:id", protect, restrictTo, deleteUser);

export default router;
