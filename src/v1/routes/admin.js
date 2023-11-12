const routes = require('express').Router()
const {
  getVerificationUsers,
  verifyUSer,
  declineUser,
} = require('../controllers/admin')

routes.get('/getVerificationUsers', getVerificationUsers)
routes.put('/approveUser/:id', verifyUSer)
routes.put('/declineUser/:id', declineUser)

module.exports = routes
