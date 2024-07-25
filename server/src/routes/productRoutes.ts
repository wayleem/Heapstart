/*
 * TODO
 */

import express from "express";
import {
	createProduct,
	getProduct,
	updateProduct,
	deleteProduct,
	getAllProducts,
} from "../controllers/productController";
import { authenticateJWT, isAdmin } from "../middleware/auth";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Protected routes
router.use(authenticateJWT, isAdmin);

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export { router as productRouter };
