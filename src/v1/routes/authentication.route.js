const routes = require('express').Router()
const {
  register,
  login,
  verifyEmail,
  refreshToken,
  resetPassword,
  resetPasswordLink,
  sendQRCode,
  verifyOtp,
} = require('../bussiness_logic/authentication')

routes.post('/register', register)
routes.post('/login', login)
routes.use('/verifyEmail/:token', verifyEmail)
routes.use('/refreshToken', refreshToken)
routes.use('/resetPasswordLink', resetPasswordLink)
routes.use('/resetPassword', resetPassword)
routes.use('/sendQRCode', sendQRCode)
routes.post('/verifyOtp', verifyOtp)

module.exports = routes
