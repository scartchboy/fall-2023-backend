
const dbConnection = require('../../utils/database')

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
    const sql =
      'SELECT  id, firstname, lastname, 	isEmailVerified, isVerified , email  FROM users'
  
    dbConnection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve user details' })
      }
  
      res.status(200).json({ users: results })
    })
  }
  