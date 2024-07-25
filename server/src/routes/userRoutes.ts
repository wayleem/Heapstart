import express from "express";
import { getProfile, updateProfile, getAllUsers } from "../controllers/userController";
import { authenticateJWT, isAdmin } from "../middleware/auth";
import { validateUserUpdate } from "../middleware/validation";

const router = express.Router();

router.get("/profile", authenticateJWT, getProfile);
router.put("/profile", authenticateJWT, validateUserUpdate, updateProfile);
router.get("/all", authenticateJWT, isAdmin, getAllUsers);

export { router as userRouter };
