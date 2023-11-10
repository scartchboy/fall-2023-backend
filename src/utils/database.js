const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fall',
})

connection.connect(function (err) {
  console.log('Db connected')
})


module.exports = connection;