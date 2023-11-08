const routers = require('express').Router()

const authenticationRoutes = require('./authentication.route')
const userRoutes = require('./user.route')
const adminRoutes = require('./admin.route')

routers.use('/user', authenticationRoutes)
routers.use('/auth/user', userRoutes)
routers.use('/auth/admin', adminRoutes)
module.exports = routers
