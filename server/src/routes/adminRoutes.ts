/*
 * WIP
 */

import express from "express";
import { loginAdmin } from "../controllers/adminController";
import { authenticateJWT, isAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/login", loginAdmin);

// Protected admin routes
router.use(authenticateJWT, isAdmin);

// Add more admin routes here
// For example:
// router.get('/dashboard', getDashboardData);
// router.put('/user/:id', updateUser);

export { router as adminRouter };
