const AppError = require('../utils/appError');
const User = require('../modelsDB/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailHandler = require('../utils/emailHandler')
const crypto = require('crypto')


const fieldsAllowedToChange = ['name', 'email']

const createJwtToken = userId => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN
  })
}

const checkFields = (allowedFields, obj) => {

  const newObj = Object.keys(obj).reduce((acc, el) => {
    if (allowedFields.includes(el)) {
      acc[el] = obj[el]
      return acc
    } else {
      return acc
    }
  }, {})

  console.log(newObj);
  return newObj
}


exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create({...req.body, passChanged: new Date().getTime()})
    const token = createJwtToken(user._id)

    res.cookie('token', token)
    res.status(201).json({
      status: 'success',
      user,
      token
    });

  } catch (e) {
    next(new AppError(e.message, 400))
  }
};

exports.loginUser = async (req, res, next) => {
  try{
    const { email, password } = req.body

    // 1) Check if email and password exists
    if ( !email || !password ){
      return next(new AppError("please provide email and password", 400))
    }

    // 2) Check if user exist and password
    const user = await User.findOne({ email: email }).select("+password")

    if (!user) return next(new AppError(`User doesn't exist`, 401))

    // 3) Check if password is correct
    const isRight = await bcrypt.compare(password, user.password)

    if (!isRight) return next(new AppError('Invalid email or password', 401))

    // 4) If everything is ok send token to the client
    const token = createJwtToken(user._id)

    res.cookie('token', token)
    res.status(200).json({
      status: 'success',
      token
    })

  } catch (e) {
    next(new AppError(e.message, 400))
  }
}

exports.protect = async (req, res, next) => {
  try {
    const { cookies } = req

    // 1) Check if there is any token
    if (!cookies || !cookies.token) {
      return next(new AppError('Please login', 401))
    }

    // 2) Check if token is right
    const JWTdata = await jwt.verify(cookies.token, process.env.JWT_SECRET)
    const { userId, exp } = JWTdata

    // 3) Check if there is any user
    const userObj = await User.findOne({ _id: userId }).select("passChanged")

    if (!userObj || userObj === {}) return next(new AppError('User is deleted', 401))

    // 4) Check user hasn't changed password
    if (userObj.passChanged >= exp * 1000) return next(new AppError('Password has been changed', 401))


    //// If everything ok next middleware
    req.userId = userId
    next()

  } catch (e) {
    next(new AppError(e.message, 401))
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    // 1) Check if there is a user with such email
    if (!user) {
      return next(new AppError('There is no such user with this email', 404))
    }

    // 2) Create password reset token
    const resetToken = user.createPassResetToken()

    // 3) Send token to user by email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message = `Reset your password here: \n ${resetUrl}`

    try {
      await mailHandler.sendEmail(
        req.body.email,
        'Your password reset token',
        message
      )

      await user.save({ validateBeforeSave: false })

    } catch (e) {

      user.passReset = undefined
      user.passResetExp = undefined

      await user.save({ validateBeforeSave: false })

      next(new AppError(e.message, 400))
    }


    // 4) If all ok send response
    res.status(201).json({
      status: 'success',
      resetToken
    })

  } catch (e) {
    next(new AppError(e.message, 401))
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Create hashed token
    const hashedToken = crypto
      .createHash('sha224')
      .update(req.params.token)
      .digest('hex')

    // 2) Check if there is user with such token and if it hasn't expired
    const user = await User
      .findOne({
        passReset: hashedToken,
        passResetExp: { $gt: Date.now() }
      })
      .select('+_id password passwordConfirm')

    if (!user) {
      return next(new AppError('Token is invalid or expired', 400))
    }

    // 3) Change password, remove reset token and save user
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm

    user.passReset = undefined
    user.passResetExp = undefined

    await user.save()

    console.log(user);
    // 4) Log user in and send JWT
    const JWTtoken = createJwtToken(user._id)
    res.status(200).json({
      status: 'success',
      token: JWTtoken
    })

  } catch (e) {
    next(new AppError(e.message, 401))
  }
}

exports.updatePassword = async (req, res, next) => {
  try {

  } catch (e) {
    next(new AppError(e.message, 403))
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    // 1) If there is password in body say that it isn't password update
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('It is user update, not password'))
    }

    // 2) Check if all fields are allowed for change
    const obj = checkFields(fieldsAllowedToChange, req.body)

    console.log(obj);
  } catch (e) {
    next(new AppError(e.message, 403))
  }
}