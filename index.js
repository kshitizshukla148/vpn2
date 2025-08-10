import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import { authenticate } from './middleweare/auth.middleware.js';
import adminRoutes from './routes/admin.routes.js';
import emailRoutes from './routes/emailTemplate.routes.js';
import lectureRoutes from './routes/lecture.routes.js';
import logsRoutes from './routes/login.routes.js';
import mailServerRoutes from './routes/mail.server.routes.js';
import registerRoutes from './routes/register.routes.js'; // Assuming you have a register route
import paymentRoutes from "./routes/payment.routes.js";
import { handleWebhook } from "./controllers/payment.controller.js";
import { notFound, errorHandler } from './middleweare/error.middleware.js';



const app = express();

// ── Global Middlewares ────────────────────────────────────────────────────────
// Enable CORS for all origins
app.use(cors());
// Parse JSON bodies
app.use(bodyParser.json());
// Parse URL-encoded bodies (form submissions)
app.use(bodyParser.urlencoded({ extended: true }));



// ── Public Routes (no auth required) ─────────────────────────────────────────
app.use('/', registerRoutes);       // Mount register route

// ── Public Routes (no auth required) ─────────────────────────────────────────
app.use('/', logsRoutes);   // mounts /login, /forgot-password, /reset-password

// ── Protect all routes below this line ────────────────────────────────────────
app.use(authenticate);     // Any subsequent route requires a valid JWT

// ── Protected Routes ─────────────────────────────────────────────────────────

app.use('/', lectureRoutes);   // Lecture CRUD
app.use('/',mailServerRoutes);

app.use('/admin', adminRoutes);

// Webhook endpoint must receive raw body. Mount it BEFORE express.json for that path.
app.post("/payments/webhook", express.raw({ type: "application/json" }), (req, res, next) => {
  // call handler
  handleWebhook(req, res).catch(next);
});

// mount other routes (which use express.json)
app.use("/payments", paymentRoutes);


app.use('/', emailRoutes);       // Email template management

// 404 handler (after all routes)
app.use(notFound);

// final error handler (after everything)
app.use(errorHandler);

export default app;
