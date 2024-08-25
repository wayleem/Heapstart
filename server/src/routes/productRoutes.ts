import express from "express";
import multer from "multer";
import path from "path";
import { productController } from "../controllers";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "uploads/"),
	filename: (req, file, cb) => cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage: storage });

// Admin routes to add and update products
router.post("/", authenticateAdmin, upload.array("newImages", 5), productController.add);
router.put("/:id", authenticateAdmin, upload.array("newImages", 5), productController.update);

// Routes to list and get products
router.get("/", productController.list);
router.get("/:id", productController.get);

// Admin route to deactivate a product
router.delete("/:id", authenticateAdmin, productController.deactivate);

export { router as productRouter };
