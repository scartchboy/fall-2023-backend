const routes = require('express').Router()

const {
  updateProfile,
  deleteAccount,
  allUser,
  changePassword
} = require('../controllers/user')


routes.post('/updateProfile/', updateProfile)
routes.post('/deleteAccount/', deleteAccount)
routes.use('/changePassword', changePassword)
routes.get('/allUsers', allUser)

module.exports = routes
