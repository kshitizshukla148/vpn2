import { v4 as uuidv4 } from 'uuid';
import { serverTimestamp } from 'firebase/firestore';

export class UserModel {
  constructor({
    name,
    email,
    passwordHash,
    role = 'student',
    ip,
    resetPasswordToken = null,
    resetPasswordExpires = null,
    purchasedCourses = [],
    purchasedInternships = [],
    registrationDetails = {},
    internshipStatus = 'applied'
  }) {
    this.userId = uuidv4(); // custom UUID, Firestore will also have its own doc ID
    this.name = name?.trim() || null;
    this.email = email?.toLowerCase();
    this.password_hash = passwordHash; // already hashed before passing
    this.role = role;
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpires = resetPasswordExpires;
    this.ip = ip || null;
    
    // New fields
    this.purchasedCourses = purchasedCourses; // Array of course IDs
    this.purchasedInternships = purchasedInternships; // Array of internship IDs
    this.registrationDetails = registrationDetails; // Object with registration info
    this.internshipStatus = internshipStatus; // applied | accepted | rejected
    
    this.createdAt = serverTimestamp();
    this.updatedAt = serverTimestamp();
  }
}

// Find user by email
export async function findUserByEmail(email) {
  const usersRef = collection(db, 'ji_users');
  const q = query(usersRef, where('email', '==', email.toLowerCase()));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}
