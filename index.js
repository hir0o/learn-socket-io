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

io.on('connection', (socket) => {
  socket.on('chat', (msg) => {
    sendChat({
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
  })
})

const sendChat = (payload) => io.emit('chat', payload)

server.listen(3000, () => {
  console.log('listening on *:3000')
})
