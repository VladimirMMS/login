const mysql = require('mysql')


const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"20012020",
    database:"login_db"
})

connection.connect((error) => {
    if (error) {
        console.log("Error in the connection" + error)
        return;
    }
    console.log("Connect to the database")
})

module.exports = connection;