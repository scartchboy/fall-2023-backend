const { response } = require('express')
const dbConnection = require('../../utils/database')
const User = require('../models/UserRegister.model')
const {
  encryptPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
} = require('../../helpers/index')

module.exports.register = async (req, res) => {
  let password = req.body.password.toString()
  const hashPassword = await encryptPassword(password)

  const { username, email } = req.body

  const newUser = { username, email, password: hashPassword }
  const sql = 'INSERT INTO users SET ?'

  dbConnection.query(sql, newUser, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'User registration failed', err })
    }

    const accessToken = await generateAccessToken(newUser)
    const refreshToken = await generateRefreshToken(newUser)
    const registeredUser = {
      username,
      email,
      accessToken,
      refreshToken,
    }
    res
      .status(201)
      .json({ message: 'User registered successfully', user: registeredUser })
  })
}

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check user credentials
    const sql = 'SELECT * FROM users WHERE email = ?'

    dbConnection.query(sql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' })
      }

      if (results.length === 1) {
        const user = results[0]

        console.log(user.password)
        console.log(password)

        const isValidPassword = verifyPassword(password, user.password)
        console.log(isValidPassword)
        if (!isValidPassword) {
          return res.send({ message: password in invalid })
        } else {
          const accessToken = await generateAccessToken(user)
          const refreshToken = await generateRefreshToken(user)
          const userDetails = {
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken,
            refreshToken,
          }
          res
            .status(200)
            .send({ message: 'Login successful', user: userDetails })
        }
      } else {
        res.status(401).json({ error: 'Invalid username or password' })
      }
    })
  } catch (e) {
    res.status(401).json({ error: 'Invalid username or password' })
  }
}

module.exports.updateProfile = async (req, res, next) => {
  const email = req.params.email
  const updatedUserData = req.body

  const sql = 'UPDATE users SET ? WHERE email = ?'

  dbConnection.query(sql, [updatedUserData, email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'User update failed' })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({ message: 'User updated successfully' })
  })
}

module.exports.deleteAccount = async (req, res, next) => {
  const email = req.params.email

  const sql = 'DELETE FROM users WHERE email = ?'

  dbConnection.query(sql, email, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'User deletion failed' })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({ message: 'User deleted successfully' })
  })
}

module.exports.allUser = async (req, res, next) => {
  const sql = 'SELECT  username, email  FROM users'

  dbConnection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve user details' })
    }

    res.status(200).json({ users: results })
  })
}
