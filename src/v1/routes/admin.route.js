const routes = require('express').Router()
const {
  getVerificationUsers,
  verificationUser,
  declineUser,
} = require('../bussiness_logic/admin')

routes.get('/getVerificationUsers', getVerificationUsers)
routes.get('/verificationUser/:id', verificationUser)
routes.get('/declineUser/:id', declineUser)

module.exports = routes
