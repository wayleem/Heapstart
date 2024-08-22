import express from "express";
import {
	createSupportTicket,
	getUserSupportTickets,
	updateSupportTicket,
	getSupportTicket,
	getAllSupportTickets,
} from "../controllers/supportTicketController";
import { authenticateAdmin, authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.get("/all", authenticateAdmin, getAllSupportTickets);
router.post("/", authenticateJWT, createSupportTicket);
router.get("/user", authenticateJWT, getUserSupportTickets);
router.get("/:id", authenticateJWT, getSupportTicket);
router.put("/:id", authenticateJWT, updateSupportTicket);

export { router as supportTicketRouter };
