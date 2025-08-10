// controllers/paymentController.js
import razorpay from "../config/razorpay.js";
import db from "../config/firebase.admin.js";
import crypto from "crypto";
import { asyncHandler, AppError } from "../middleweare/error.middleware.js";

/**
 * Create order (server-side).
 * Body: { amount } where amount is in rupees (Number)
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = "INR", receipt, notes = {}, userId } = req.body;

  // basic validation
  if (amount === undefined || amount === null) {
    throw new AppError("Amount is required", 400, true);
  }
  const amountNumber = Number(amount);
  if (Number.isNaN(amountNumber) || amountNumber <= 0) {
    throw new AppError("Invalid amount (must be a positive number)", 400, true);
  }

  // convert rupees to paise
  const amountPaise = Math.round(amountNumber * 100);

  const options = {
    amount: amountPaise,
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
    notes,
    payment_capture: 1, // auto-capture
  };

  // create order on Razorpay
  const rOrder = await razorpay.orders.create(options);

  // Save to Firestore: collection 'orders', doc id = razorpay order id
  const orderRef = db.collection("orders").doc(rOrder.id);

  const snap = await orderRef.get();
  if (!snap.exists) {
    await orderRef.set({
      userId: userId || null,
      razorpayOrderId: rOrder.id,
      amount: rOrder.amount, // in paise
      currency: rOrder.currency,
      receipt: rOrder.receipt,
      status: "created",
      notes: rOrder.notes || {},
      createdAt: new Date().toISOString(),
    });
  }

  return res.status(201).json({
    orderId: rOrder.id,
    amount: rOrder.amount,
    currency: rOrder.currency,
    receipt: rOrder.receipt,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

/**
 * Verify payment returned by client (Checkout success).
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError("Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature", 400, true);
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    // signature mismatch — mark as failed and throw operational error
    await db.collection("orders").doc(razorpay_order_id).set(
      { status: "failed", paymentId: razorpay_payment_id, signature: razorpay_signature, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    throw new AppError("Invalid signature — possible tampering", 400, true, { expected: generatedSignature, received: razorpay_signature });
  }

  // mark order paid
  await db.collection("orders").doc(razorpay_order_id).set(
    { status: "paid", paymentId: razorpay_payment_id, signature: razorpay_signature, paidAt: new Date().toISOString() },
    { merge: true }
  );

  return res.json({ message: "Payment verified", orderId: razorpay_order_id });
});

/**
 * Webhook handler — expects raw body (express.raw) mounted on route.
 * Verify 'x-razorpay-signature'. Use asyncHandler so any thrown error goes to error middleware.
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  if (!signature) {
    throw new AppError("Missing x-razorpay-signature header", 400, true);
  }
  // req.body should be a Buffer because route uses express.raw({type: 'application/json'})
  const bodyBuffer = req.body;
  const bodyString = bodyBuffer instanceof Buffer ? bodyBuffer.toString("utf8") : JSON.stringify(req.body);

  const expected = crypto.createHmac("sha256", secret).update(bodyString).digest("hex");
  if (expected !== signature) {
    console.warn("Webhook signature mismatch");
    throw new AppError("Webhook signature mismatch", 400, true, { expected, received: signature });
  }

  // parse event and handle
  const event = JSON.parse(bodyString);
  const eventName = event.event;

  if (eventName === "payment.captured" || eventName === "payment.authorized") {
    const entity = event.payload?.payment?.entity;
    const razorpayOrderId = entity?.order_id;
    const razorpayPaymentId = entity?.id;
    if (razorpayOrderId) {
      await db.collection("orders").doc(razorpayOrderId).set(
        { status: "paid", paymentId: razorpayPaymentId, webhookEvent: eventName, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    }
  } else if (eventName === "payment.failed") {
    const entity = event.payload?.payment?.entity;
    const razorpayOrderId = entity?.order_id;
    if (razorpayOrderId) {
      await db.collection("orders").doc(razorpayOrderId).set(
        { status: "failed", webhookEvent: eventName, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    }
  } else if (eventName === "order.paid") {
    const entity = event.payload?.order?.entity;
    const razorpayOrderId = entity?.id;
    if (razorpayOrderId) {
      await db.collection("orders").doc(razorpayOrderId).set(
        { status: "paid", webhookEvent: eventName, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    }
  }

  // respond quickly to Razorpay
  res.status(200).json({ ok: true, received: true });
});

/**
 * Simple: list orders (for admin)
 */
export const getOrders = asyncHandler(async (req, res) => {
  const snap = await db.collection("orders").orderBy("createdAt", "desc").limit(100).get();
  const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(orders);
});
