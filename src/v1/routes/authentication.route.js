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
routes.get('/verifyEmail/:token', verifyEmail)
routes.use('/refreshToken', refreshToken)
routes.post('/resetPasswordLink', resetPasswordLink)
routes.post('/resetPassword', resetPassword)
routes.use('/sendQRCode', sendQRCode)
routes.post('/verifyOtp', verifyOtp)

module.exports = routes
