require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config/env');

// Start the server
const PORT = process.env.PORT || config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});