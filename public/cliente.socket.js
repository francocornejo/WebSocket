const socket = io()

const formMessage = document.querySelector('#formMessage')
const emailInput = document.querySelector('#emailInput')
const messageInput = document.querySelector('#messageInput')
const contenedorMensaje = document.querySelector('#messagesPool')
const formProduct = document.querySelector('#formProduct')
const titleInput = document.querySelector('#title')
const priceInput = document.querySelector('#price')
const thumbnailInput = document.querySelector('#thumbnail')
const tablaProd = document.querySelector('#tablaProd')


function sendMessage() {
    try{
        const email = emailInput.value
        const message = messageInput.value
    
        socket.emit('cliente: message', {email, message})
    } catch(err){
        console.log(`Ha ocurrido un error ${err}`)
    }
}

function MensajesRender(messageArr) {
    const dia = new Date()
    const year = dia.getDate()+ "/"+ dia.getMonth() + "/" +dia.getFullYear() + "-" + dia.getHours() + ":" + dia.getMinutes() + ":" + dia.getSeconds(); 
 
    try{
        const hbs = messageArr.map(text =>{
            return(`<div>
                        <span>${text.email} ${year}</span>
                        <em>${text.message}</em>
                    </div>`)
        }).join(" ");

        contenedorMensaje.innerHTML = hbs
    }catch(err){
        console.log(`Ha ocurrido un error ${err}`)
    }
}

formMessage.addEventListener('submit', event =>{
    event.preventDefault()
    sendMessage()
    messageInput.value = ""
})

function sendProduct() {
    try{
        const title = titleInput.value
        const price = priceInput.value
        const thumbnail = thumbnailInput.value
    
        socket.emit('cliente: product', {title, price, thumbnail})
    } catch(err){
        console.log(`Ha ocurrido un error ${err}`)
    }
}

async function ProductRender(productArr) {
  
    try{
        document.querySelector('#tableEmpty').innerHTML="" 
        const plantilla = await fetch('/plantilla.hbs')
        const plantillaText = await plantilla.text()
 
            if(productArr.length > 0){
                productArr.forEach(product => {
                    const template = Handlebars.compile(plantillaText)
                    const hbsProd = template(product) 

                    tablaProd.innerHTML += hbsProd
                })
            }else{
                document.querySelector('#tableEmpty').innerHTML = ("<h4>No hay ningun producto :(</h4>")
            }
        }catch(err){
            console.log(`Ha ocurrido un error ${err}`)
        }
    }

formProduct.addEventListener('submit', event =>{
    event.preventDefault()
    sendProduct()
})

socket.on('server: message', MensajesRender)
socket.on('server: product', ProductRender)