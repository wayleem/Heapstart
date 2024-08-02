import express from "express";
import { getProfile, updateProfile, getAllUsers } from "../controllers/userController";
import { authenticateJWT } from "../middleware/auth";
import { validateUserUpdate } from "../middleware/validation";

const router = express.Router();

router.get("/profile", authenticateJWT, getProfile);
router.put("/profile", authenticateJWT, validateUserUpdate, updateProfile);
router.put("/cart", authenticateJWT, updateCart);
router.get("/cart", authenticateJWT, getCart);
router.get("/all", authenticateJWT, getAllUsers);

export { router as userRouter };
