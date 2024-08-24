// src/routes/index.ts

import { Router } from "express";
import { authRouter } from "./authRoutes";
import { userRouter } from "./userRoutes";
import { adminRouter } from "./adminRoutes";
import { productRouter } from "./productRoutes";
import { orderRouter } from "./orderRoutes";
import { paymentRouter } from "./paymentRoutes";
import { supportTicketRouter } from "./supportTicketRoutes";
import { promoCodeRouter } from "./promoCodeRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/admin", adminRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/payment", paymentRouter);
router.use("/support-tickets", supportTicketRouter);
router.use("/promo-codes", promoCodeRouter);

export default router;
