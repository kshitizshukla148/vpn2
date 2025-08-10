import db from '../config/firebase.admin.js'; // This should export admin.firestore()

const usersCollection = db.collection('ji_users');

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error getting users', error: err.message });
  }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userDoc = await usersCollection.doc(req.params.id).get();
    if (userDoc.exists) {
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
    const createdRef = await usersCollection.add(newUser);
    res.status(201).json({ message: 'User created', id: createdRef.id });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    await usersCollection.doc(req.params.id).update(req.body);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    await usersCollection.doc(req.params.id).delete();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};
