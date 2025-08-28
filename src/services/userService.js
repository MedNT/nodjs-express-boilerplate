const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const { supabase } = require('../config/database');
const { generateAuthToken } = require('../utils/helpers');

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
      .insert([{ 
        type, 
        name, 
        email,
        password: hashedPassword 
      }])
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

const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const { data: users, count, error } = await supabase
      .from('clients')
      .select('id, type, name, email, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex - 1);

    if (error) throw error;

    const totalPages = Math.ceil(count / limit);
    
    logger.debug(`Fetched ${users.length} users from database`);
    return {
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit
      }
    };
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers
};