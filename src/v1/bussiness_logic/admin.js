const dbConnection = require('../../utils/database')

module.exports.getVerificationUsers = async (req, res) => {
  try {
    const sql =
      'SELECT id,firstname,lastname,email FROM users WHERE isVerified = false'

    dbConnection.query(sql, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'Failed to retrieve user details', err })
      }

      res.status(200).json({ users: results })
    })
  } catch (e) {
    res.send(e.message)
  }
}

module.exports.verifyUSer = async (req, res) => {
  try {
    const userId = req.params.id
    const updateQuery = 'UPDATE users SET isVerified = true WHERE id = ?'

    dbConnection.query(updateQuery, [userId], (err, results) => {
      if (err) {
        console.error('Error updating user: ' + updateErr)
        res.status(500).json({ error: 'Internal server error' })
        return
      }

      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      res.status(200).json({ message: 'User verified successfully' })
    })
  } catch (e) {
    res.send(e.message)
  }
}

module.exports.declineUser = async (req, res) => {
  try {
    const userId = req.params.id

    const deleteQuery = 'DELETE FROM users WHERE id = ?'
    dbConnection.query(deleteQuery, [userId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' })
        return
      }
      res.status(200).json({ message: 'User Declined successfully' })
    })
  } catch (error) {
    res.send(e.message)
  }
}
