require('dotenv').config()
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const test_db = process.env.DB_URI_TESTING;

app.use(express.json());

// Mongoose connection 
const mongoose = require('mongoose')
mongoose.connect(test_db)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to DB'))

app.get('/', async (req, res) => {
  try {
    const products = await Product.find({})
    res.send(products)
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
});

app.post('/', async (req, res) => {
  try {
      console.log(req.body)
      const product = new Product({
        name: req.body.name
      })
      const newProduct = await product.save()
      res.status(201).send(newProduct)

  } catch (error) {
      res.status(500).json({ message: error.message })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

// product mongoose-schema

const productSchema = new mongoose.Schema({ 
  //id: string,
  name: String, /*
  description: String, 
  manufacturer: String,
  price: Number, // EUR
  chip: String,
  memory: Number, // MB
  rating: Number, // 0.0 - 1.0
  packageDimensions: {
      x: Number, // cm
      y: Number, // cm
      z: Number, // cm
  },
  packageWeight: Number, // kg */
}, { timestamps: true });

Product = mongoose.model(
  'Product', 
  productSchema
);