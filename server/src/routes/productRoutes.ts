import express from "express";
import {
	getAllProducts,
	getProduct,
	createProduct,
	updateProduct,
	deactivateProduct,
} from "../controllers/productController";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProduct);

export { router as productRouter };
