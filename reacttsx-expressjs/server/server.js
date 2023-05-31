const express = require('express')
const app = express()

app.use(express.json())

// for test router
const testRouter = require('./routes/test')
app.use('/test', testRouter)

app.listen(5000, () => { console.log(`Server started on port 5000`) })