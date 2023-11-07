const routes = require('express').Router()
const { getVerificationUsers,verificationUser } = require('../bussiness_logic/admin')


routes.get('/getVerificationUsers',getVerificationUsers)
routes.get('/verificationUser/:id',verificationUser)


module.exports = routes;
