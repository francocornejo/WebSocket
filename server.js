const express = require('express')
const app = express()
const  { Server: IOServer } = require('socket.io')
const path = require('path')
const puerto = 8080
const message = []
const product = []

app.use(express.static(path.join(__dirname, '/public')))

const serverExpress = app.listen(puerto, (err)=>{
    if (err) {
        console.log(`Ocurrio un error ${err}`)
    }else{
        console.log(`Servidor escuchando puerto: ${puerto}`)
    }
})

const io =  new IOServer(serverExpress)

io.on('connection', socket => {
    console.log(`Se conecto un usuario ID: ${socket.id}`)
    
    io.emit('server: message', message)
    socket.on('cliente: message', infoMensaje =>{
        message.push(infoMensaje)
        io.emit('server: message', message)
    } )

    io.emit('server: product', product)
    socket.on('cliente: product', infoProduct =>{
        product.push(infoProduct)
        io.emit('server: product', product)
    } )
})