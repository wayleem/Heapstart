// routes/adminRoutes.ts

import express from "express";
import { loginAdmin, getAdminProfile } from "../controllers/adminController";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/login", loginAdmin);

// Protected admin routes
router.use(authenticateAdmin);

router.get("/profile", getAdminProfile);

export { router as adminRouter };
