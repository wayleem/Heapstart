import express from "express";
import { ticketController } from "../controllers";
import { authenticateAdmin, authenticateJWT } from "../middleware/auth";

const router = express.Router();

// Admin routes to list all support tickets
router.get("/", authenticateAdmin, ticketController.list);

// Authenticated users can create a support ticket
router.post("/", authenticateJWT, ticketController.add);

// Authenticated users can view their own support tickets by ID
router.get("/:id", authenticateJWT, ticketController.get);

// Authenticated users can update their own support tickets
router.put("/:id", authenticateJWT, ticketController.update);

// Authenticated users can delete their own support tickets
router.delete("/:id", authenticateJWT, ticketController.remove);

export { router as ticketRouter };
