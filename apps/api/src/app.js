const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const healthCheckRouter = require('./routes/healthCheck');
const authRoutes = require('./routes/authRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(cors());
app.use(express.json());
app.set('query parser', 'extended');

console.log('API initialized');
console.log('Environment Variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
}); //REMOVE: for debugging purposes only

if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
  app.use(morgan('dev'));
}

app.use('/api/v1/health', healthCheckRouter);
app.use('/api/v1/auth', authRoutes);

app.use(globalErrorHandler);

module.exports = app;
