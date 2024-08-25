import express from "express";
import { userController } from "../controllers";
import { authenticateJWT, authenticateAdmin } from "../middleware/auth";
import { orderRouter } from "./orderRoutes";
import { ticketRouter } from "./ticketRoutes";

const router = express.Router();

// Admin routes to list all users
router.get("/", authenticateAdmin, userController.list);

// Routes for authenticated users to view and update their cart
router.get("/cart", authenticateJWT, userController.getCart);
router.post("/cart", authenticateJWT, userController.addToCart);
router.put("/cart", authenticateJWT, userController.updateCartItem);
router.delete("/cart/:productId", authenticateJWT, userController.removeFromCart);
router.delete("/cart", authenticateJWT, userController.clearCart);

// Routes to manage user orders
router.use(
	"/:userId/orders",
	authenticateJWT,
	(req, res, next) => {
		req.query.filter = JSON.stringify({ userId: req.userId });
		next();
	},
	orderRouter,
);

// Routes to manage user support tickets
router.use(
	"/:userId/support-tickets",
	authenticateJWT,
	(req, res, next) => {
		req.query.filter = JSON.stringify({ userId: req.userId });
		next();
	},
	ticketRouter,
);

export { router as userRouter };
