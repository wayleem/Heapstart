import { Router } from "express";
import { authRouter } from "./authRoutes";
import { userRouter } from "./userRoutes";
import { adminRouter } from "./adminRoutes";
import { productRouter } from "./productRoutes";
import { orderRouter } from "./orderRoutes";
import { paymentRouter } from "./paymentRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/admin", adminRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/payment", paymentRouter);

export default router;
