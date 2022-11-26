const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const mongoURI = 'mongodb+srv://jaywadekar18:jaywadekar18@cluster0.8dtlgoa.mongodb.net/?retryWrites=true&w=majority'
const cors = require('cors');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const Chat = require('./models/chatModel')
const http = require('http');
let server = http.createServer(app);
const { Server } = require("socket.io")
const { response } = require('express')
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",

  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('setup', own => {
    console.log('joined own chat with chat ID-->', own)
    socket.join(own)
  })
  socket.on('join chat', room => {
    socket.join(room)
    console.log('joined soneones chat wirh id-->', room)
  })
  socket.on('new message', async (chatId, message) => {
    try {


      console.log('chatId ,message', chatId, message)
      let response = await Chat.find({ _id: chatId });
      if (response[0]?.peopleInvolvedInChat) {

        // socket.in(chatId).emit('message received', message);
        response[0].peopleInvolvedInChat.forEach(personId => {
          console.log('personId.............................', personId)
          console.log('message' ,message);
          if (String(personId) === message?.senderId) return;
          
          socket.in(String(personId)).emit('message received', message);
          console.log('sending mg to' , personId , '-->' ,message)
          // socket.in(chatId).emit('message received',message);
        })

      }
      console.log('response[0].peopleInvolvedInChat', response[0].peopleInvolvedInChat)
    }
    catch (err) {
      console.log('err', err)
    }
  })


});

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


app.use('/api/user', userRoutes)
app.use('/api/mesaage', messageRoutes)
app.use('/api/chat', chatRoutes);


app.use(errorHandler);
app.use(notFound);
server.listen(5000, () => {
  console.log('Server running');
})


