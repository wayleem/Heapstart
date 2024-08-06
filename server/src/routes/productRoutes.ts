import express from "express";
import {
	createProduct,
	deactivateProduct,
	getAllProducts,
	getProduct,
	updateProduct,
} from "../controllers/productController";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Admin routes
router.post("/", authenticateAdmin, createProduct);
router.put("/:id", authenticateAdmin, updateProduct);
router.delete("/:id", authenticateAdmin, deactivateProduct);

export { router as productRouter };
