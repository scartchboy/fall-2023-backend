const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Password@123',
  database: 'cs518',
})

connection.connect(function (err) {
  if(err)
    console.log(err);
  console.log('connected')
})
     

module.exports = connection;