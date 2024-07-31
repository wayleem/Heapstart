import express from "express";
import {
	getAllProducts,
	getProduct,
	createProduct,
	updateProduct,
	deactivateProduct,
} from "../controllers/productController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Admin routes
router.post("/", authenticateJWT, createProduct);
router.put("/:id", authenticateJWT, updateProduct);
router.delete("/:id", authenticateJWT, deactivateProduct);

export { router as productRouter };
