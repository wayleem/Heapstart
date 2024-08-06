import express from "express";
import { register, login, forgotPassword, resetPassword, loginAdmin, logout } from "../controllers/authController";
import { validateRegistration, validateLogin } from "../middleware/validation";
import { authenticateAdmin, authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/logout", authenticateJWT, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/admin/login", authenticateAdmin, loginAdmin);

export { router as authRouter };
