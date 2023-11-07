
const dbConnection = require('../../utils/database')
const {
  encryptPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
} = require('../../helpers/index')

module.exports.register = async (req, res) => {
  try {
    let password = req.body.password.toString()
    const hashpassword = await encryptPassword(password)

    const { firstname, lastname, email } = req.body

    const newUser = { firstname, lastname, email, hashpassword }
    const sql = 'INSERT INTO users SET ?'

    dbConnection.query(sql, newUser, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'User registration failed', err })
      }

      const accessToken = await generateAccessToken(newUser)
      const refreshToken = await generateRefreshToken(newUser)
      const registeredUser = {
        firstname,
        lastname,
        email,
        accessToken,
        refreshToken,
      }
      res
        .status(201)
        .json({ message: 'User registered successfully', user: registeredUser })
    })
  } catch (error) {
    return res.status(500).json({ error: 'User registration failed', err })
  }
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

        try {
          const isValidPassword = await verifyPassword(
            password,
            user.hashpassword,
          )

          if (!isValidPassword) {
            return res.send({ message: 'password is invalid' })
          }
        } catch (error) {
          return next(error.message)
        }
        const accessToken = await generateAccessToken(user)
        const refreshToken = await generateRefreshToken(user)
        const userDetails = {
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken,
          refreshToken,
        }
        res.status(200).send({ message: 'Login successful', user: userDetails })
      } else {
        res.status(401).json({ error: 'Invalid username or password' })
      }
    })
  } catch (e) {
    res.status(401).json({ error: 'Invalid username or password' })
  }
}



