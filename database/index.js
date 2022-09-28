const { Pool } = require('pg')
const user = process.env.DBUSER
const password = process.env.USERPASSWORD
const admin = process.env.DBADMIN
const adminPassword = process.env.ADMINPASSWORD
const host = process.env.DBHOST
const database = process.env.DBDATABASE
const port = process.env.DBPORT


//Define properites for database
const userPool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
  connectionString: process.env.DATABASE_URL,

})

const adminPool = new Pool({
    user: admin,
    host: host,
    database: database,
    password: adminPassword,
    port: port,
    connectionString: process.env.DATABASE_URL,

})

try {
  userPool.connect()
  adminPool.connect()
}catch (err) {
  console.log(err)
}
//Connect webUser all the time

//export query
module.exports = {
  userQuery: (text, params) => userPool.query(text, params),
  adminQuery: (text, params) => adminPool.query(text, params),
}
