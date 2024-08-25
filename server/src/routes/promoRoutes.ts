import express from "express";
import { promoController } from "../controllers";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateAdmin, promoController.add);
router.get("/", authenticateAdmin, promoController.list);
router.put("/:id", authenticateAdmin, promoController.update);
router.delete("/:id", authenticateAdmin, promoController.remove);
router.post("/validate", promoController.validate);

export { router as promoRouter };
