require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config/env');

// Start the server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});