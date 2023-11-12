const jwt = require('jsonwebtoken')
const env = require('dotenv')
module.exports.generateAccessToken = async ({ email }) => {
  const accessToken = await jwt.sign(
    {
      email: email,
    },

    process.env.ACCESS_KEY,
    {
      expiresIn: '1d',
    },
  )
  return accessToken
}
module.exports.generateRefreshToken = async ({ email }) => {
  const accessToken = await jwt.sign(
    {
      email: email,
    },

    process.env.REFRESH_KEY,
    {
      expiresIn: '1d',
    },
  )
  return accessToken
}

module.exports.verifyAccessToken = async (hashAccessToken) => {
  const decoded = jwt.verify(hashAccessToken, process.env.ACCESS_KEY)
  return decoded
}
module.exports.verifyRefreshToken = async (hashAccessToken) => {
  const decoded = jwt.verify(hashAccessToken, process.env.REFRESH_KEY)
  return decoded
}
