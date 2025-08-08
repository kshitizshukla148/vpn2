import db from '../config/firebase.admin.js';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const usersCollection = collection(db, 'ji_users');

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error getting users', error: err.message });
  }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userDoc = await getDoc(doc(usersCollection, req.params.id));
    if (userDoc.exists()) {
      res.json({ id: userDoc.id, ...userDoc.data() });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error getting user', error: err.message });
  }
};

// ✅ Create new user
export const createUser = async (req, res) => {
  try {
    const newUser = req.body;
    const created = await addDoc(usersCollection, newUser);
    res.status(201).json({ message: 'User created', id: created.id });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    const userRef = doc(usersCollection, req.params.id);
    await updateDoc(userRef, req.body);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    await deleteDoc(doc(usersCollection, req.params.id));
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};
