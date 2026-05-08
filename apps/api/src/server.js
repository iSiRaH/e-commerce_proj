const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const app = require('./app');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
