import express from "express";
import {
  createProduct,
  getProduct,
  updateProduct,
  deactivateProduct,
  getAllProducts,
  uploadProductImages,
} from "../controllers/productController";
import { authenticateJWT, isAdmin } from "../middleware/auth";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Protected routes
router.use(authenticateJWT, isAdmin);

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deactivateProduct);
router.post("/:id/images", upload.array("images", 5), uploadProductImages);

export { router as productRouter };
