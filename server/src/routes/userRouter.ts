import { Router } from "express";
import {
  login,
  register,
  getMe,
  deleteUser,
  getAllUsers,
} from "../controllers/userController";
import { protect, restrictTo } from "../middleware/authMiddileware";


const router = Router();

router.get("/", protect, restrictTo, getAllUsers);
router.get("/me", protect, getMe);
router.delete("/delete/:id", protect, restrictTo, deleteUser);

export default router;
