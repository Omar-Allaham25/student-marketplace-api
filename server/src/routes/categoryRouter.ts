import Router from "express";
import { CreateCategory, deleteCategory, editCategory, getAll } from "../controllers/categoryController";
import { protect, restrictTo } from "../middleware/authMiddileware";
import { validate } from "../middleware/validation";
import { createCategorySchema, updateCategorySchema } from "../validators/categoryValidator";

const router = Router();
router.use(protect);
router.get("/getAll", getAll);
router.post("/create", restrictTo, validate(createCategorySchema), CreateCategory);
router.patch("/modify/:id", restrictTo, validate(updateCategorySchema), editCategory);
router.delete("/delete/:id", restrictTo, deleteCategory);

export default router;
