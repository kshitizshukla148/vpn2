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


app.use('/', emailRoutes);       // Email template management

export default app;
