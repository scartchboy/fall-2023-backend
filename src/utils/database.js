const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fall',
})

connection.connect(function (err) {
  if(err)
    console.log(err);
  console.log('connected')
})


module.exports = connection;