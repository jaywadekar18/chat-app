const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const mongoURI = 'mongodb+srv://jaywadekar18:jaywadekar18@cluster0.8dtlgoa.mongodb.net/?retryWrites=true&w=majority'
const cors = require('cors');
const { errorHandler, notFound } = require('./middlewares/errorHandler')
mongoose.connect(mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Connected mongoose") })
    .catch((err) => { console.log("Mongoose connection error", err) })

dotenv.config()
app.use(cors());
app.use(express.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
// app.get('/', function (req, res) {
//     res.send('Hello World')
// })
app.use('/api/user', userRoutes)
app.use('/api/mesaage', messageRoutes)
app.use('/api/chat', chatRoutes);


app.use(errorHandler);
app.use(notFound);
app.listen(5000, () => {
    console.log('Server running');
})