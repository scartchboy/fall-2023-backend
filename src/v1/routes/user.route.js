
const routes = require('express').Router()


const {
    updateProfile,
    deleteAccount,
    allUser,
  } = require('../bussiness_logic/user')
  
routes.post('/updateProfile/:id', updateProfile)
routes.post('/deleteAccount/:id', deleteAccount)
routes.get('/allUsers', allUser)

module.exports = routes;
