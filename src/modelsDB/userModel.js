const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name!'],
      maxlength: [20, 'Name cannot be longer than 20 characters'],
      minlength: [2, 'Name cannot be shorter that 2 characters'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'A user must have an email!'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Invalid email']
    },
    password: {
      type: String,
      required: [true, 'A user must have a password!'],
      trim: true,
      minlength: [8, 'Password must be at least 8 characters long'],
      maxlength: [24, 'Password cannot be longer than 24 characters']
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Confirm your password'],
      trim: true,
      minlength: [8, 'Password must be at least 8 characters long'],
      maxlength: [24, 'Password cannot be longer than 24 characters'],
      validate: {
        validator: function (val) {
          return val === this.password
        },
        message: 'Passwords must be the same'
      }
    },
    passChanged: {
      type: Number,
      required: [true, 'Please enter your expiredAt Date for password'],
      trim: true
    },
    passReset: String,
    passResetExp: Number
  }
)

userSchema.pre('save', async function (next) {
  // Check is password been modified
  if (!this.isModified('password')) return next()

  // ● Encrypting the password and changing timestamp
  this.password = await bcrypt.hash(this.password, 12)
  this.passChanged = Date.now() - 1000

  // ● Deleting field PasswordConfirm
  this.passwordConfirm = undefined

  // Next middleware
  next()
})

userSchema.methods.createPassResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passReset = crypto
    .createHash('sha224')
    .update(resetToken)
    .digest('hex')

  this.passResetExp = Date.now() + 10 *  60 * 1000

  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User