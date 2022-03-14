const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController')


const router = express.Router();

router
   .route('/')
   .get(
      authController.protect,
      userController.getAllUsers
   )

router
  .route('/signup')
  .post(authController.createUser)

router
  .route('/login')
  .post(authController.loginUser)


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
   .route('/me')
   .get(
      authController.protect,
      userController.getMe,
      userController.getUser
   )

router
  .route('/:id')
  .get(
      authController.protect,
      userController.getUser
  )
  .patch(
      authController.protect,
      userController.updateUser
  )
  .delete(
      authController.protect,
      userController.deleteUser
  );


module.exports = router;
