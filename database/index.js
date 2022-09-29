const { Pool } = require('pg')
const admin = process.env.DBADMIN
const adminPassword = process.env.ADMINPASSWORD
const host = process.env.DBHOST
const database = process.env.DBDATABASE
const port = process.env.DBPORT


//Define properites for database
const adminPool = new Pool({
    user: admin,
    host: host,
    database: database,
    password: adminPassword,
    port: port,
    connectionString: process.env.DATABASE_URL,

})

try {
  adminPool.connect()
}catch (err) {
  console.log(err)
}

//export query
module.exports = {
  query: (text, params) => adminPool.query(text, params),
}
