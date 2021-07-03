const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const users = {}

io.on('connection', (socket) => {
  socket.on('login', ({ userId }) => {
    console.log('socket id', socket.id)
    users[socket.id] = userId
  })

  socket.on('chat', (msg) => {
    // 自分以外に送信
    socket.broadcast.emit('chat', {
      type: 'chat',
      message: msg.message,
      nickName: msg.nickName
    })
  })

  socket.on('disconnect', () => {
    sendChat({
      type: 'announce',
      message: 'ユーザーが退室しました'
    })
    delete users[socket.id]
  })
})

const sendChat = (payload) => io.emit('chat', payload)

server.listen(3000, () => {
  console.log('listening on *:3000')
})
