import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { categortController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

//create category
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

//update category
router.patch("/update-category/:id",requireSignIn,isAdmin,updateCategoryController);

//GET ALL CATEGORIES
router.get("/get-category", categortController);

//Single category
router.get("/single-category/:slug", singleCategoryController);

//Delete category
router.delete("/delete-categort/:pid",requireSignIn,isAdmin, deleteCategoryController);

export default router;