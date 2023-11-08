const routes = require('express').Router()
const {
  register,
  login,
  verifyEmail,
} = require('../bussiness_logic/authentication')

routes.post('/register', register)
routes.get('/login', login)
routes.use('/verifyEmail/:token', verifyEmail)

module.exports = routes
