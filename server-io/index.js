const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8000'
    }
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('join_room', (data) => {
        socket.join(data)
        console.log(`${socket.id} join ${data}`)
    })

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data)
        console.log(`From ${socket.id} to ${data.room}: ${data.message}`)
    })

    socket.on('disconnect', (data) => {
        console.log('User disconnected', socket.id)
    })
})

server.listen(3001, () => {
    console.log('Server running...')
})