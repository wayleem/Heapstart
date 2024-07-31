/*
 * TODO
 */

import express from "express";
import { createOrder, getOrder, updateOrderStatus, getUserOrders } from "../controllers/orderController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateJWT, createOrder);
router.get("/user", authenticateJWT, getUserOrders);
router.get("/:id", authenticateJWT, getOrder);

// Admin only routes

router.put("/:id/status", updateOrderStatus);

export { router as orderRouter };
