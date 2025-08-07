

// controllers/register.controller.js
import User from '../models/user.model.js';             // Mongoose User model
import jwt from 'jsonwebtoken';                          // JSON Web Token library
import { sendMail } from '../models/emailTemplates.model.js'; // Email sending utility

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';  // Secret key for token generation

/**
 * @desc    Register a new user, send welcome email, and return JWT
 * @route   POST /api/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    // Destructure expected fields from request body
    const { email, password, name, dob, mobile } = req.body;

    // Debug log of incoming data (remove in production)
    console.log('Register attempt:', { email, name, dob, mobile });

    // Ensure required fields are present
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Check if user already exists in DB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Prepare dynamic variables for registration email
    const variables = {
      '{full_name}': name || 'User',
      '{email}': email,
      '{login_link}': 'https://your-login-url.com'
    };

    // Email details
    const emailData = {
      to: email,
      templateType: 'registration', // email template key
      variables
    };

    // Send email asynchronously
    await sendMail(emailData);

    // Create and save new user instance
    const newUser = new User({
      email,
      password_hash: password, // Under the hood, model will hash this
      name: name || null,
      dob: dob || null,
      mobile: mobile || null
    });
    await newUser.save();

    // Generate a JWT token for authentication
    const token = jwt.sign(
      { id: newUser._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Respond with success payload
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    // Log full error for debugging (avoid leaking in prod)
    console.error('Registration Error:', error);
    // Pass error to Express error handler or send generic response
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
