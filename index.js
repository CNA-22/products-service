require('dotenv').config()
const express = require('express')
const app = express();
const port = process.env.PORT;
const test_db = process.env.DB_URI_TESTING;

// Mongoose connection 
const mongoose = require('mongoose')
mongoose.connect(test_db)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to DB'))

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});