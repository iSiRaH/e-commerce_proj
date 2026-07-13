const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router
  .route('/')
  .get(paymentController.getAllPayments)
  .post(paymentController.createPayment);
router.route('/user/:userId').get(paymentController.getPaymentsByUser);
router.route('/order/:orderId').get(paymentController.getPaymentsByOrder);
router
  .route('/:id')
  .get(paymentController.getPayment)
  .patch(paymentController.updatePayment)
  .delete(paymentController.deletePayment);

module.exports = router;
