import express from "express";
import multer from "multer";
import path from "path";
import {
	createProduct,
	updateProduct,
	getAllProducts,
	getProduct,
	deactivateProduct,
} from "../controllers/productController";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // Ensure this directory exists
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

router.post("/", authenticateAdmin, upload.array("newImages", 5), createProduct);
router.put("/:id", authenticateAdmin, upload.array("newImages", 5), updateProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.delete("/:id", authenticateAdmin, deactivateProduct);

export { router as productRouter };
