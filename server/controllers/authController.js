import User from '../models/User.js';
import Client from '../models/Client.js';
import { sendTokenResponse, generateVerificationToken, generateResetToken } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

/**
 * @desc    Register new user (Job Seeker)
 * @route   POST /api/auth/register/user
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'user',
      emailVerificationToken: generateVerificationToken()
    });

    // Send verification email (non-blocking)
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${user.emailVerificationToken}`;
    const message = `Welcome to AI Job Portal! Please verify your email by clicking: ${verificationUrl}`;
    const html = `
      <h1>Welcome to AI Job Portal</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
    `;

    // Process email in background to prevent request hang
    sendEmail({
      email: user.email,
      subject: 'Email Verification - AI Job Portal',
      message,
      html
    }).catch(err => console.error('Background Email Error (User):', err.message));

    sendTokenResponse(user, 201, res, 'User registered successfully. Verification email sent.');
  } catch (error) {
    console.error('Register User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

/**
 * @desc    Register new client (Employer)
 * @route   POST /api/auth/register/client
 * @access  Public
 */
export const registerClient = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone,
      companyName,
      companyIndustry,
      companySize,
      companyCity,
      companyCountry,
      contactPersonName,
      contactPersonEmail
    } = req.body;

    // Check if client already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Client with this email already exists'
      });
    }

    // Create client
    const client = await Client.create({
      name,
      email,
      password,
      phone,
      role: 'client',
      company: {
        name: companyName,
        industry: companyIndustry,
        size: companySize,
        location: {
          city: companyCity,
          country: companyCountry
        }
      },
      contactPerson: {
        name: contactPersonName,
        email: contactPersonEmail,
        phone
      },
      emailVerificationToken: generateVerificationToken()
    });

    // Send verification email (non-blocking)
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${client.emailVerificationToken}`;
    const message = `Welcome to AI Job Portal! Please verify your company email by clicking: ${verificationUrl}`;
    const html = `
      <h1>Welcome to AI Job Portal</h1>
      <p>Please click the link below to verify your company email address:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
    `;

    // Process email in background
    sendEmail({
      email: client.email,
      subject: 'Company Verification - AI Job Portal',
      message,
      html
    }).catch(err => console.error('Background Email Error (Client):', err.message));

    sendTokenResponse(client, 201, res, 'Client registered successfully. Verification email sent.');
  } catch (error) {
    console.error('Register Client Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering client',
      error: error.message
    });
  }
};

/**
 * @desc    Login user/client
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user based on role
    let account;
    if (role === 'user' || !role) {
      account = await User.findOne({ email }).select('+password');
    }
    if (!account && (role === 'client' || !role)) {
      account = await Client.findOne({ email }).select('+password');
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!account.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordMatch = await account.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    account.lastLogin = new Date();
    await account.save();

    sendTokenResponse(account, 200, res, 'Login successful');
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = { ...req.body };
    
    // Remove fields that shouldn't be updated via this route
    delete fieldsToUpdate.password;
    delete fieldsToUpdate.email;
    delete fieldsToUpdate.role;

    let updatedUser;
    if (req.userRole === 'user') {
      updatedUser = await User.findByIdAndUpdate(
        req.userId,
        fieldsToUpdate,
        { new: true, runValidators: true }
      );
    } else if (req.userRole === 'client') {
      updatedUser = await Client.findByIdAndUpdate(
        req.userId,
        fieldsToUpdate,
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    // Get user with password
    let account;
    if (req.userRole === 'user') {
      account = await User.findById(req.userId).select('+password');
    } else if (req.userRole === 'client') {
      account = await Client.findById(req.userId).select('+password');
    }

    // Check current password
    const isMatch = await account.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    account.password = newPassword;
    await account.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

/**
 * @desc    Forgot password - Send reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    const client = await Client.findOne({ email });
    const account = user || client;

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Generate reset token
    const { resetToken, hashedToken } = generateResetToken();
    account.resetPasswordToken = hashedToken;
    account.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await account.save();

    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please click: ${resetUrl}`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>Please click the link below to reset your password. This link is valid for 10 minutes.</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    `;

    try {
      await sendEmail({
        email: account.email,
        subject: 'Password Reset Request - AI Job Portal',
        message,
        html
      });
    } catch (err) {
      account.resetPasswordToken = undefined;
      account.resetPasswordExpire = undefined;
      await account.save();
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      resetToken // Remove this in production
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password request'
    });
  }
};

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const resetToken = req.params.resetToken;

    // Hash the token from URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find account with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    const client = await Client.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    const account = user || client;

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    account.password = newPassword;
    account.resetPasswordToken = undefined;
    account.resetPasswordExpire = undefined;
    await account.save();

    sendTokenResponse(account, 200, res, 'Password reset successful');
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find account with verification token
    const user = await User.findOne({ emailVerificationToken: token });
    const client = await Client.findOne({ emailVerificationToken: token });
    const account = user || client;

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Verify email
    account.isEmailVerified = true;
    account.emailVerificationToken = undefined;
    await account.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify Email Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email'
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    // In JWT implementation, logout is handled client-side by removing token
    // This endpoint can be used for logging or token blacklisting
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out'
    });
  }
};

export default {
  registerUser,
  registerClient,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout
};