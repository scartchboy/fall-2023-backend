const routes = require('express').Router()

const {
  updateProfile,
  deleteAccount,
  allUser,
  changePassword
} = require('../bussiness_logic/user')

routes.post('/updateProfile/', updateProfile)
routes.post('/deleteAccount/', deleteAccount)
routes.use('/changePassword', changePassword)
routes.get('/allUsers', allUser)


module.exports = routes
