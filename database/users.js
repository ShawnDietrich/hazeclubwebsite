const { adminQuery } = require('./index')
const db = require('./index')
const pgp = require('pg-promise')()

module.exports = class UserDatabase {
    async create(data, table) {
        try {
            const query = pgp.helpers.insert(data, null, table) + 'RETURNING *'
            //query to create user in database
            const result = await db.query(query)

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
            const query = 'UPDATE users SET "firstName" = $1, "lastName" = $2, password = $3 WHERE id = $4'
            const queryData = [data.firstName, data.lastName, data.password, data.id]
            
            //query to update user
            const result = await db.query(query, queryData)
            if (result) {
                console.log('update complete')
                return true
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
            const result = await db.query(query, values)
            if (result) {
                return result.rows[0]
            }
            return null
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    async findById(userid, table) {
        try {
            const query = `SELECT * FROM ${table} WHERE user_id = $1`
            const id = [userid]
            const result = await db.query(query, id)
            if (result) {
                return result.rows
            }
            return null
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    async findByName(name, table) {
        try{
            const query = `SELECT * From ${table} WHERE list_name = $1`
            const data = [name]
            const result = await db.query(query, data)
            if(result) {
                return result.rows
            }else 
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
            const result = await db.query(query, userid)
            if (result) return true
            return false
        }catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }
}