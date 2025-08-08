import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/admin.controller.js';

const router = express.Router();

// ✅ GET all users
router.get('/users', getAllUsers);

// ✅ GET single user by ID
router.get('/users/:id', getUserById);

// ✅ CREATE new user
router.post('/users', createUser);

// ✅ UPDATE user
router.put('/users/:id', updateUser);

// ✅ DELETE user
router.delete('/users/:id', deleteUser);

export default router;
