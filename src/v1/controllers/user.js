const dbConnection = require('../../utils/database')
const {
  encryptPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
} = require('../../utils/index')

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { email } = req.decoded
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
  } catch (e) {
    res.send(e.message)
  }
}

module.exports.deleteAccount = async (req, res, next) => {
  try {
    const { email } = req.decoded
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
  } catch (e) {
    res.send(e.message)
  }
}

module.exports.allUser = async (req, res, next) => {
  const sql =
    'SELECT  id, firstname, lastname, 	isEmailVerified, isVerified , email  FROM users'

  dbConnection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve users details' })
    }

    res.status(200).json({ users: results })
  })
}

module.exports.changePassword = async (req, res, next) => {
  const { email } = req.decoded
  const { oldPassword, newPassword } = req.body

  try {
    const getOldPasswordQuery = 'SELECT hashpassword from users WHERE email = ?'
    const updatePasswordQuery =
      'UPDATE users SET hashpassword = ? WHERE email = ?'

    dbConnection.query(getOldPasswordQuery, [email], async (err, result) => {
      const password = result[0].hashpassword

      const isValidPassword = await verifyPassword(oldPassword, password)

      if (!isValidPassword) {
        return res.status(500).send({ message: 'password is invalid' })
      } else {
        const hashpassword = await encryptPassword(newPassword)
        dbConnection.query(
          updatePasswordQuery,
          [hashpassword, email],
          (updateErr, updateResults) => {
            if (updateErr) {
              res
                .status(500)
                .send({ error: 'Internal server error', message: updateErr })
            } else {
              res.status(200).json({ message: 'Password changed successfully' })
            }
          },
        )
      }
    })
  } catch (e) {
    res.status(500).send({ error: 'Internal server error', message: e.message })
  }
}
