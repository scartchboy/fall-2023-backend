const routes = require('express').Router()
const {
  register,
  login,
  verifyEmail,
  verifyEmail,
  refreshToken,
  resetPassword,
} = require('../bussiness_logic/authentication')

routes.post('/register', register)
routes.get('/login', login)
routes.use('/verifyEmail/:token', verifyEmail)
routes.use('/declineUser/:token', declineUser)
routes.use('/refreshToken', refreshToken)
routes.use('/resetPassword', resetPassword)

module.exports = routes
