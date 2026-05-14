const express = require('express');
const prisma = require('../config/connectDb');

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is healthy and running on port 3000',
  });
});

router.route('/db').get(async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', db: 'database connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'database unreachable' });
  }
});
module.exports = router;
