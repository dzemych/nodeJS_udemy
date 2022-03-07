const nodemailer = require('nodemailer')


exports.sendEmail = async function (email, subject, message) {

  // 1) Create transporter on mailtrap
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "435764c9047c3f",
      pass: "57d29c0beccdde"
    }
  })

  // 2) Set email options
  const emailOptions = {
    from: 'Dzemych Ivan',
    to: email,
    text: message,
    subject
  }

  // 3) Send email
  await transporter.sendMail({
    from: 'Dzemych Ivan <dzemichivan@gmail.com>',
    to: email,
    subject,
    text: message
  })
}