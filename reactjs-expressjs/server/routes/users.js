const express = require('express')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const router = express.Router()

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_khayas',
})

router.post('/createUser', (req, res) => {
  const { username, password, lastname, firstname, middlename, position } = req.body

  res.setHeader('Cache-Control', 'no-store')
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Failed to create user' })
    }
    const user = { username, password: hashedPassword, lastname, firstname, middlename, position }

    pool.getConnection((err, connection) => {
      if (err) throw err

      connection.query('INSERT INTO users SET ?', user, (err, rows) => {
        connection.release()

        if (err) {
          console.log(err)
          return res.status(500).json({ error: 'Failed to create user' })
        }

        res.json({ status: 'created' })
      })
    })
  })
})

router.get('/updateUser', (req, res) => {
  // update user
})

router.get('/loadUsers', (req, res) => {
  // load users
})

router.get('/loadUserData/:id', (req, res) => {
  // load user
  req.params.id
})

module.exports = router
