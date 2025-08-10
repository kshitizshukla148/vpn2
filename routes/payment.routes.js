// routes/paymentRoutes.js
import express from "express";
import { createOrder, verifyPayment, getOrders } from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/orders", getOrders);

// Note: webhook route mounted in app.js with express.raw
export default router;
