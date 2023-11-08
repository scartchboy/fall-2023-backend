const nodemailer = require('nodemailer')

const env = require('dotenv')

const transporter = nodemailer.createTransport({
  service: 'Gmail',

  auth: {
    user: 'badrinath6024@gmail.com',
    pass: 'mmnk akaf jmuc vdty',
  },
})

module.exports.SendEmail = async ({ email, subject, text, token }) => {

  const info = await transporter.sendMail({
    from: '"syn" <badrinath6024@gmail.com>',
    to: email,
    subject: subject,
    text: text,
    html: `<a href="http://localhost:5000/v1/user/verifyEmail/${token}">click here</a>`,
  })

  return info
}
