import express from "express";
import { register, login, forgotPassword, resetPassword, loginAdmin } from "../controllers/authController";
import { validateRegistration, validateLogin } from "../middleware/validation";

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/admin/login", loginAdmin);

export { router as authRouter };
