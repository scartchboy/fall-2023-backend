const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',

  auth: {
    user: 'badrinath6024@gmail.com',
    pass: 'mmnk akaf jmuc vdty',
  },
})

module.exports.SendEmail = async ({ email, subject, text, html }) => {

  const info = await transporter.sendMail({
    from: '"syn" <badrinath6024@gmail.com>',
    to: email,
    subject: subject,
    text: text,
    html: html,
  })

  return info
}
