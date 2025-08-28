const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const { supabase } = require('../config/database');
const { generateAuthToken } = require('../utils/helpers');
const crypto = require('crypto');
const transporter = require('../config/email');

const registerUser = async (userData) => {
  try {
    const { type, name, email, password } = userData;

    // Check if user already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('clients')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      logger.warn(`Registration failed - Email already exists: ${email}`);
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { data: newUser, error } = await supabase
      .from('clients')
      .insert([
        {
          type,
          name,
          email,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    logger.info(`New user registered: ${email}`);
    return newUser;
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    // Get user from database
    const { data: user, error: lookupError } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    if (!user || lookupError) {
      logger.warn(`Login failed - Invalid email: ${email}`);
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed - Invalid password for: ${email}`);
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateAuthToken(user);

    logger.info(`User logged in: ${email}`);
    return { user, token };
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    throw error;
  }
};

const requestPasswordReset = async (email) => {
  const user = await supabase
    .from('clients')
    .select('*')
    .eq('email', email)
    .single();

  if (!user.data) {
    throw new Error('User not found');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

  // Save token to database
  await supabase
    .from('clients')
    .update({
      reset_password_token: resetToken,
      reset_password_expires: resetTokenExpiry,
    })
    .eq('email', email);

  // Send email
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: {
      name: process.env.EMAIL_NAME,
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: 'Password Reset Request',
    html: `Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.`,
  };

  await transporter.sendMail(mailOptions);

  return { success: true, message: 'Password reset email sent' };
};

const resetPassword = async (token, newPassword) => {
  const user = await supabase
    .from('clients')
    .select('*')
    .eq('reset_password_token', token)
    .gte('reset_password_expires', new Date().toISOString())
    .single();

  if (!user.data) {
    throw new Error('Invalid or expired reset token');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear reset token
  await supabase
    .from('clients')
    .update({
      password: hashedPassword,
      reset_password_token: null,
      reset_password_expires: null,
    })
    .eq('reset_password_token', token);

  return { success: true, message: 'Password reset successfully' };
};

// Add to module.exports
module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
};
