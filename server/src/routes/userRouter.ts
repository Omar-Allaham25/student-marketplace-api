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
router.use(protect);
router.get("/", restrictTo, getAllUsers);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", getMe);
router.delete("/delete/:id", restrictTo, deleteUser);

export default router;