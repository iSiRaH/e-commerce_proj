const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.route('/updateMyPassword').patch(authController.updatePassword);

router.route('/me').get(authController.protect, authController.getMe);
router
  .route('/updateMe')
  .patch(authController.protect, authController.updateMe);
router
  .route('/deleteMe')
  .delete(authController.protect, authController.deleteMe);

module.exports = router;
