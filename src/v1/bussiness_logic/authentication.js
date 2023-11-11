const dbConnection = require('../../utils/database')

const { SendEmail } = require('../../utils/emailservice')

const { verifyAccessToken, verifyRefreshToken } = require('../../helpers/jwt')

const speakeasy = require('speakeasy')
var QRCode = require('qrcode')

const {
  encryptPassword,
  verifyPassword,

  generateAccessToken,
  generateRefreshToken,
} = require('../../helpers/index')

module.exports.register = async (req, res) => {
  try {
    let password = req.body.password.toString()
    const hashpassword = await encryptPassword(password)

    const { firstname, lastname, email } = req.body

    const newUser = { firstname, lastname, email, hashpassword }
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?'
    const sql = 'INSERT INTO users SET ?'

    dbConnection.query(checkUserQuery, [email], (err, results) => {
      if (err) {
        res.status(500).send({ error: 'Internal server error' })
        return
      }

      if (results.length > 0) {
        res.status(400).send({ error: 'User with this email already exists' })
        return
      } else {
        dbConnection.query(sql, newUser, async (err) => {
          if (err) {
            return res.status(500).send({ error: 'User registration failed' })
          }
          const verificationToken = await generateAccessToken(newUser)

          const mailOptions = {
            email: email,
            subject: 'Email Verification',
            text: `Hello , Please Verify your email by Clicking verify Button `,
            html: `<a href="http://localhost:5000/v1/user/verifyEmail/${verificationToken}">click here</a>`,
          }

          try {
            await SendEmail(mailOptions)
            res.status(200).send({
              message: 'User registered successfully. Verification email sent.',
            })
            return
          } catch (error) {
            res.status(500).send({
              error: 'Verification Email sending failed',
              message: error.message,
            })
          }
        })
      }
    })
  } catch (error) {
    return res.status(500).json({ error: 'User registration failed', error })
  }
}

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check user credentials
    const sql = 'SELECT * FROM users WHERE email = ?'

    dbConnection.query(sql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' })
      }

      if (results.length === 1) {
        const user = results[0]

        const isValidPassword = await verifyPassword(
          password,
          user.hashpassword,
        )

        if (!isValidPassword) {
          return res.send({ message: 'password is invalid' })
        }

        const accessToken = await generateAccessToken(user)
        const refreshToken = await generateRefreshToken(user)
        const userDetails = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          isAdmin: user.isAdmin,
          accessToken,
          refreshToken,
        }
        var secret = speakeasy.generateSecret()
        QRCode.toDataURL(secret.otpauth_url, function (err, data_url) {
          res.status(200).send({
            message: 'Login successful',
            user: userDetails,
            code: secret.base32,
            QrCode: '<img src="' + data_url + '">',
          })
        }).catch((err) => {
          res.send({ message: error.message })
        })
      } else {
        res.status(401).json({ error: 'Invalid username or password' })
      }
    })
  } catch (e) {
    res.status(401).json({ error: 'Invalid username or password' })
  }
}

module.exports.verifyEmail = async (req, res, next) => {
  const token = req.params.token
  try {
    console.log(req.params.token)
    const { email } = await verifyAccessToken(token)
    const sql = `UPDATE users SET isEmailVerified = true WHERE email='${email}'`
    dbConnection.query(sql, function (error, result) {
      res.send({ message: 'email verification successful' })
    })
  } catch (e) {
    res.send({ message: e.message })
  }
}

module.exports.resetPassword = async (req, res, next) => {
  const { email } = req.body

  const userCheckQuery = 'SELECT * FROM users WHERE email = ?'

  dbConnection.query(userCheckQuery, [email], async (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'User not found' })
    }
    if (results.length === 0) {
      res.status(404).send({ error: 'User not found' })
    }
    const verificationToken = await generateAccessToken({ emaill })

    const mailOptions = {
      email: email,
      subject: 'reset password',
      text: `Hello , Please use the link below to set the new password `,
      html: `<a href="http://localhost:5000/v1/user/verifyEmail/${verificationToken}">click here</a>`,
    }

    try {
      await SendEmail(mailOptions)
      res.status(200).json({
        message: 'User registered successfully. Verification email sent.',
      })
    } catch (error) {
      res.status(500).json({
        error: 'Verification Email sending failed',
        message: error.message,
      })
    }
  })
}

module.exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const { email } = await verifyRefreshToken(refreshToken)

    const accessToken = await generateAccessToken({ email })
    const newRefreshToken = await generateRefreshToken({ email })

    res.send({
      accessToken,
      refreshToken: newRefreshToken,
    })
  } catch (e) {}
}

module.exports.sendQRCode = (req, res) => {
  try {
    var secret = speakeasy.generateSecret()
    QRCode.toDataURL(secret.otpauth_url, function (err, data_url) {
      res.send({
        code: secret.base32,
        QrCode: '<img src="' + data_url + '">',
      })
    }).catch((err) => {
      res.send({ message: error.message })
    })
  } catch (error) {
    res.send({ message: error.message })
  }
}

module.exports.verifyOtp = (req, res) => {
  const { otp, code } = req.body

  try {
    const isVerified = speakeasy.totp.verify({
      secret: code,
      encoding: 'base32',
      token: otp,
    })

    if (!isVerified) {
      res.status(500).send({ success: false, message: 'verified failed' })
    }

    res.send({ success: true, message: 'verified successful' })
  } catch (error) {
    res.send({ success: false, message: error.message })
  }
}
