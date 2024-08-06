// routes/adminRoutes.ts

import express from "express";
import { loginAdmin, getAdminProfile } from "../controllers/adminController";
import { authenticateAdmin } from "../middleware/auth";
import { createProduct, deactivateProduct, updateProduct } from "../controllers/productController";

const router = express.Router();

router.post("/login", loginAdmin);

// Protected admin routes
router.use(authenticateAdmin);

router.get("/profile", getAdminProfile);

// Admin routes
router.post("/products/", authenticateAdmin, createProduct);
router.put("/products/:id", authenticateAdmin, updateProduct);
router.delete("/products/:id", authenticateAdmin, deactivateProduct);

export { router as adminRouter };
