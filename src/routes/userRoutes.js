const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController')

const router = express.Router();

router
  .route('/signup')
  .post(authController.createUser)

router
  .route('/login')
  .post(authController.loginUser)

router
  .route('/')
  .get(
    authController.protect,
    userController.getAllUsers
  )

router.post(
  '/updateUser',
  authController.protect,
  authController.updateUser
)

router.post(
  './updatePassword',
  authController.protect,
  authController.updatePassword
)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
