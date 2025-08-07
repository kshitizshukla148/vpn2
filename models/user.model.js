import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['admin', 'instructor', 'student'],
    default: 'student',
  },
  password_hash:
   { type: String, required: true },
  resetPasswordToken: 
    { type: String },
  resetPasswordExpires:
   { type: Date   },
  ip: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,     // Automatically adds createdAt and updatedAt
  versionKey: false,    // Disables __v field
});

const User = mongoose.model("ji_users", userSchema);
export default User;
