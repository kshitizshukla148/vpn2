import db from '../config/firebase.admin.js';
import { collection, query, where, getDocs, addDoc, setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import {hashPassword} from  "../middleweare/hash.password.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';




// Register new user
export async function registerUser(email, password, name, dob, mobile) {
  const hashedPassword = await hashPassword(password);

  const usersRef = collection(db, 'ji_users');
  const newUserDoc = await addDoc(usersRef, {
    email: email.toLowerCase(),
    password_hash: hashedPassword,
    name: name || null,
    dob: dob || null,
    mobile: mobile || null,
    role: 'student',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const token = jwt.sign({ id: newUserDoc.id }, JWT_SECRET, { expiresIn: '7d' });
  return token;
}
