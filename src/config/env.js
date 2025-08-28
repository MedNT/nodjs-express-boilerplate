require('dotenv').config();

module.exports = {
  port: process.env.PORT | 8080,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
};