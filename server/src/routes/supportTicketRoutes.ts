import express from "express";
import {
	createSupportTicket,
	getUserSupportTickets,
	updateSupportTicket,
	getSupportTicket,
} from "../controllers/supportTicketController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateJWT, createSupportTicket);
router.get("/user", authenticateJWT, getUserSupportTickets);
router.get("/:id", authenticateJWT, getSupportTicket);
router.put("/:id", authenticateJWT, updateSupportTicket);

export { router as supportTicketRouter };
