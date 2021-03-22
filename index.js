const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')

const app = express()
app.use(cors())
app.use(bodyParser())

const authRoutes = require('./src/routes/auth')
const blogRoutes = require('./src/routes/blog')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  const type = ['image/png', 'image/jpg', 'image/jpeg']
  if(type.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

app.use('/v1/auth', authRoutes)
app.use('/v1/blog', blogRoutes)

app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;
  
  res.status(status).json({
    message: message,
    data: data    
  })
})

mongoose.connect('mongodb://ihsandev123:ihsandev123@cluster0-shard-00-00.gncdt.mongodb.net:27017,cluster0-shard-00-01.gncdt.mongodb.net:27017,cluster0-shard-00-02.gncdt.mongodb.net:27017/mern-db?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', 
{ useNewUrlParser: true,  useUnifiedTopology: true })
  .then(() => {
    app.listen(4001, () => console.log('Connection Success'))
  })
  .catch(err => console.log(err))
