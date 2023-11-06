const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fall',
})

connection.connect(function (err) {
  console.log('connected')
})


module.exports = connection;