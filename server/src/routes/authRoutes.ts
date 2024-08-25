import express from "express";
import { authController } from "../controllers";
import { validateRegistration, validateLogin } from "../middleware/validation";
import { authenticateAdmin, authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/register", validateRegistration, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/logout", authenticateJWT, authController.logout);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

router.post("/admin/login", authenticateAdmin, authController.loginAdmin);

export { router as authRouter };
