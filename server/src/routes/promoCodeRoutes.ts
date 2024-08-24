// src/routes/promoCodeRoutes.ts

import express from "express";
import {
	createPromoCode,
	getAllPromoCodes,
	updatePromoCode,
	deletePromoCode,
	validatePromoCode,
} from "../controllers/promoCodeController";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateAdmin, createPromoCode);
router.get("/", authenticateAdmin, getAllPromoCodes);
router.put("/:id", authenticateAdmin, updatePromoCode);
router.delete("/:id", authenticateAdmin, deletePromoCode);
router.post("/validate", validatePromoCode);

export { router as promoCodeRouter };
