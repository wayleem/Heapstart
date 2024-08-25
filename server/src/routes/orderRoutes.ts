import express from "express";
import { orderController } from "../controllers";
import { authenticateAdmin, authenticateJWT } from "../middleware/auth";

const router = express.Router();

// Admin routes to list all orders
router.get("/", authenticateAdmin, orderController.list);

// Authenticated users can create orders
router.post("/", authenticateJWT, orderController.add);

// Authenticated users can view their own orders by ID
router.get("/:id", authenticateJWT, orderController.get);

// Admin can update the status of any order
router.put("/:id", authenticateAdmin, orderController.update);

export { router as orderRouter };
