const express = require('express');

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.route('/db').get((req, res) => {
  res.status(404).json({ status: 'This route is not implemented yet' });
});
module.exports = router;
