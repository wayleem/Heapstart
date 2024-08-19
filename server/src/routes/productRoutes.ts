import express from "express";
import multer from "multer";
import {
	createProduct,
	deactivateProduct,
	getAllProducts,
	getProduct,
	updateProduct,
} from "../controllers/productController";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Admin routes
router.post("/", authenticateAdmin, upload.array("images", 5), createProduct);
router.put("/:id", authenticateAdmin, upload.array("images", 5), updateProduct);
router.delete("/:id", authenticateAdmin, deactivateProduct);

export { router as productRouter };
