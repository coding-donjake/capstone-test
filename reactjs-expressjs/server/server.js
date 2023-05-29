const express = require('express')
const app = express()

const userRouter = require('./routes/users')

app.use(express.json())


app.get('/test', (req, res) => {
  res.setHeader('Cache-Control', 'no-store')
  res.json({ "message": "Hello!" });
})

app.listen(5000, () => { console.log(`Server started on port 5000`) })