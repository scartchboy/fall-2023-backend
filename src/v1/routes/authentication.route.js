const routes = require('express').Router()
const {  register,login,updateProfile ,deleteAccount,allUser} = require('../bussiness_logic/authentication')


routes.post('/user/register', register)
routes.get('/user/login',login)
routes.post('/auth/user/updateProfile/:email',updateProfile)
routes.post('/auth/user/deleteAccount/:email',deleteAccount)
routes.get('/user/allUsers',allUser)




module.exports = routes;
