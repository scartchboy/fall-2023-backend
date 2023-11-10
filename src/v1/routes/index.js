const routers = require('express').Router()

const authenticationRoutes = require('./authentication.route')
const userRoutes = require('./user.route')
const adminRoutes = require('./admin.route')

routers.use('/auth/user', authenticationRoutes)
routers.use('/user', userRoutes)
routers.use('/admin', adminRoutes)
module.exports = routers
