const express = require('express')
const router = express.Router()

const moment = require('moment-timezone')
const util = require('util')

const bcrypt = require('bcrypt')
const mysql = require('mysql2')

const manilaTime = moment().tz('Asia/Manila')

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_test',
})

const hashPassword = util.promisify(bcrypt.hash)
const query = util.promisify(pool.query).bind(pool)

router.get('/', (req, res) => {
  res.json({ status: 'ok' })
})

router.post('/createUser', async (req, res) => {
  try {
    const {
      username,
      password,
      name,
    } = req.body
    const hashedPassword = await hashPassword(password, 10)
    const colms = {
      username,
      datetime: manilaTime.format('YYYY-MM-DD HH:mm:ss'),
      password: hashedPassword,
      name,
    }
    const result = await query('INSERT INTO users SET ?', colms)
    if (result.affectedRows <= 0) {
      res.status(500).json({ error: 'query failed' })
    } else {
      res.json({ result: 'ok' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'server error' })
  }
})

router.post('/updateUser', async (req, res) => {
  try {
    const {
      id,
      password,
      name,
    } = req.body
    const hashedPassword = await hashPassword(password, 10)
    const colms = {
      datetime: manilaTime.format('YYYY-MM-DD HH:mm:ss'),
      password: hashedPassword,
      name,
    }
    const result = await query('UPDATE users SET ? WHERE id = ?', [colms, id])
    if (result.affectedRows <= 0) {
      res.status(500).json({ error: 'query failed' })
    } else {
      res.json({ result: 'ok' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'server error' })
  }
})

router.get('/getUser/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await query('SELECT * FROM users WHERE id = ?', [id])
    if (result.length === 0) {
      res.status(404).json({ error: 'not found' })
    } else {
      res.json({ data: result[0] })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'server error' })
  }
})

router.get('/getUsers', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users')
    res.json({ users: result })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'server error' })
  }
})

router.get('/searchUsers/:key', async (req, res) => {
  try {
    const { key } = req.params
    const searchResult = await query('SELECT * FROM users WHERE id = ? OR username = ? OR name = ?', [key, key, key])
    res.json({ data: searchResult })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'server error' })
  }
})

module.exports = router