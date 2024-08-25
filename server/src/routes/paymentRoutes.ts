import express from "express";
import { paymentController } from "../controllers";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateJWT, paymentController.processPayment);
router.post("/create-intent", paymentController.createPaymentIntent);

export { router as paymentRouter };
