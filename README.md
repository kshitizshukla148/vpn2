# 📝Happy coding! 🚀

# VPN Academy Backend

This project is a Node.js Express-based backend implementing:

- **User Registration & Authentication** with JWT
- **Email Templating** (CRUD + dynamic sending)
- **Lecture Management** (video lectures with YouTube integration)

It follows a clean, modular architecture with:
- **Controllers**: Business logic per feature
- **Routes**: Endpoint definitions + validation
- **Models**: Mongoose schemas + utilities
- **Middleware**: Authentication and error handling

---

## 📁 Project Structure

```text
project-root/
├── controllers/             # Business logic for each feature
│   ├── register.controller.js   # Handles /api/register
│   ├── login.controller.js      # Handles /login, /forgot-password, /reset-password
│   ├── emailTemplate.controller.js  # CRUD for email templates
│   └── lecture.controller.js    # CRUD for lectures + YouTube ID parsing
├── middleware/              # Custom middleware
│   └── auth.middleware.js       # JWT validation
├── models/                  # Mongoose schemas & utilities
│   ├── user.model.js            # User schema + password hashing
│   ├── emailTemplates.model.js  # Email template schema + mailer
│   └── lecture.model.js         # Lecture schema with videoUrl & youtubeId
├── routes/                  # Route definitions & validation
│   ├── register.route.js        # /api/register
│   ├── login.routes.js          # /login, /forgot-password, /reset-password
│   ├── emailTemplate.routes.js  # /email endpoints
│   └── lecture.routes.js        # /lectures endpoints
├── app.js (or index.js)     # Express app setup & mounting
├── .env                     # Environment variables (DB URI, JWT_SECRET, etc.)
├── package.json             # Dependencies & scripts
└── README.md                # This file
```

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
git clone https://github.com/your-username/todo-auth-service.git
cd todo-auth-service
```
2. **Install dependencies**
   ```bash
npm install
# or
yarn install
```
3. **Environment Variables**
   Create `.env` in project root:
   ```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/your_db
JWT_SECRET=your_super_secret_key
EMAIL_API_KEY=...       # for third‑party mail service
```
4. **Run the server**
   ```bash
npm start
# or for dev:
npm run dev
```

Server listens on `http://localhost:${process.env.PORT || 4000}`

---

## 🔗 API Endpoints

### Public Routes (No Auth)

| Method | Route              | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/api/register`    | Register a new user            |
| POST   | `/login`           | Login & receive JWT            |
| POST   | `/forgot-password` | Send password reset link       |
| POST   | `/reset-password`  | Reset password via token       |

### Protected Routes (Require `Authorization: Bearer <token>`)

#### Email Templates

| Method | Route                   | Description                       |
| ------ | ----------------------- | --------------------------------- |
| GET    | `/email`                | List all email templates          |
| POST   | `/email`                | Create a new email template       |
| GET    | `/email/:key`           | Retrieve a template by its key    |
| PUT    | `/email/:key`           | Update an existing template       |
| DELETE | `/email/:key`           | Delete a template by its key      |

#### Lectures

| Method | Route                     | Description                                               |
| ------ | ------------------------- | --------------------------------------------------------- |
| POST   | `/lectures`               | Create lecture (extracts YouTube ID internally)           |
| GET    | `/lectures`               | List all lectures with populated creator details          |
| GET    | `/lectures/:id`           | Retrieve one lecture by MongoDB ID                       |
| PUT    | `/lectures/:id`           | Update lecture; re-validates YouTube URL if changed      |
| DELETE | `/lectures/:id`           | Delete a lecture by its ID                               |

---

## 🔧 Validation & Error Handling

- **express-validator** ensures robust request validation.
- Routes return **400 Bad Request** with details on validation failures.
- Unexpected errors return **500 Internal Server Error** with a safe message.

---

## 🔒 Security & Best Practices

- **Password Hashing:** Mongoose pre-save hooks using bcrypt.
- **JWT Expiry:** Tokens expire in 7 days (`expiresIn: '7d'`).
- **Env Variables:** Secrets and URIs stored in `.env`.
- **Modular Design:** Separation of concerns for maintainability.

---

## 🤝 Contributing

1. Fork & clone the repo
2. Create a branch: `git checkout -b feature/xyz`
3. Commit changes & push
4. Open a PR for review

---



---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vpndigitalservice/vpnds-academy.git
cd todo-auth-service
```

### 2. Install dependencies

```bash
npm install
# or
# yarn install
```

### 3. Configure environment variables

Create a `.env` file in the project root with:

```env
PORT=4000                              # Server port
MONGODB_URI=mongodb://localhost:27017/your_db
JWT_SECRET=your_super_secret_key
EMAIL_API_KEY=...                      # if using third‑party mail service
```

### 4. Run the server

```bash
npm start
# or for development with auto‑reload
npm run dev
```

The server will be available at `http://localhost:4000` (or your specified `PORT`).

---

## 🔗 API Endpoints

### Auth & Registration (Public)

| Method | Route              | Description                  |
| ------ | ------------------ | ---------------------------- |
| POST   | `/api/register`    | Register a new user          |
| POST   | `/login`           | Authenticate and get a token |
| POST   | `/forgot-password` | Send password reset link     |
| POST   | `/reset-password`  | Reset user password          |

### Protected (JWT required)

| Method | Route           | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/email`        | List email templates      |
| POST   | `/email`        | Create new email template |
| PUT    | `/email/:id`    | Update existing template  |
| DELETE | `/email/:id`    | Delete template           |
| GET    | `/lectures`     | List lectures             |
| POST   | `/lectures`     | Create a lecture          |
| PUT    | `/lectures/:id` | Update a lecture          |
| DELETE | `/lectures/:id` | Delete a lecture          |

> **Note:** All protected routes require an `Authorization: Bearer <token>` header.

---

## 🔧 Validation & Error Handling

* **Express-validator** is used for request payload validation in routes.
* Validation errors return **400 Bad Request** with a JSON array of issues.
* Uncaught errors are logged and return **500 Internal Server Error**.

---

## 🔒 Security & Best Practices

* Passwords are hashed via Mongoose pre-save hooks (bcrypt).
* JWT tokens include a 7-day expiration.
* Environment variables store secrets and DB URIs.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push: `git push origin feature/your-feature`
5. Open a pull request

---



This repository provides the backend for VPN Academy, built with Node.js, Express, MongoDB, and Mongoose. It implements:

- **User authentication** (login with JWT)
- **Password reset flow** (request reset & perform reset via JWT)
- **Email templating** for registration and password-reset emails

---

## 🚀 Features

1. **Login**  
   - `POST /login`  
   - Validates email & password  
   - Returns a JWT for authenticated requests

2. **Forgot Password**  
   - `POST /forgot-password`  
   - Accepts `{ email }`  
   - Generates a one-hour reset token and emails a reset link

3. **Reset Password**  
   - `POST /reset-password`  
   - Accepts `{ token, newPassword }`  
   - Verifies token, updates user’s password, and clears reset fields

4. **Email Templates**  
   - Stored in MongoDB collection `email_templates`  
   - Variables injected into HTML templates (`{{full_name}}`, `{{email}}`, `{{reset_password_link}}`, etc.)

---

## 📦 Installation

1. **Clone** the repo:
   ```bash
   git clone https://github.com/your-org/vpn-academy-backend.git
   cd vpn-academy-backend




