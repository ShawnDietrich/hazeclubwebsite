const { adminQuery } = require('./index')
const db = require('./index')
const pgp = require('pg-promise')()

module.exports = class UserDatabase {
    async create(data) {
        try {
            const query = pgp.helpers.insert(data, null, 'users') + 'RETURNING *'
            //query to create user in database
            const result = await db.adminQuery(query)

            //check that the insert was complete
            if (result) {
                return result.rows[0]
            }
            return null
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    async update(data) {
        try {
            //set format for query
            const query = 'UPDATE users SET "firstName" = $1, "lastName" = $2, brewery = $3 WHERE id = $4'
            const queryData = [data.firstName, data.lastName, data.brewery, data.id]
            
            //query to update user
            const result = await db.adminQuery(query, queryData)
            if (result) {
                return result.rows[0]
            }
            return null
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    async findByEmail(email) {
        try {
            // format statement
            const query = 'SELECT * FROM users WHERE email = $1'
            const values = [email] 
            //query to find user by email
            const result = await db.userQuery(query, values)
            if (result) {
                return result.rows[0]
            }
            return null
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    async findById(userid) {
        try {
            const query = 'SELECT * FROM users WHERE id = $1'
            const id = [userid]
            const result = await db.query(query, id)
            if (result) {
                return result.rows[0]
            }
            return null
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    //Get the list of brewies
    async returnBrewies() {
        try {
            const query = "select brewery from users where brewery is not null and brewery <> '' "
            const result = await db.userQuery(query)
            
            if(result) return result.rows
            return null 
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    //Get list of all users
    async returnAllUsers() {
        try{
            const query = "SELECT * from users order by id"
            const result = await db.userQuery(query)
            if(result) return result.rows
            return null
        }catch (err) {
            console.log(err)
            throw new Error(err)
            
        }
    }

    async deleteUser(id) {
        try{
            const query = 'DELETE from users where id = $1'
            const userid = [id]
            const result = await db.adminQuery(query, userid)
            if (result) return true
            return false
        }catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }
}