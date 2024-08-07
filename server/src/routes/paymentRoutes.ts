import express from "express";
import { createPaymentIntent, processPayment } from "../controllers/paymentController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateJWT, processPayment);
router.post("/create-payment-intent", createPaymentIntent);

export { router as paymentRouter };
