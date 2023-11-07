const routes = require('express').Router()
const { register, login } = require('../bussiness_logic/authentication')

routes.post('/register', register)
routes.get('/login', login)

module.exports = routes
