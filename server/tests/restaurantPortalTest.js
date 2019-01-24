const io = require('socket.io-client')

const http = require('../../utilities/promisifiedHTTP')
const config = require('../../config')

function handleNewOrder (order, socket) {
  // console.log('New order is', order)
  setTimeout(() => socket.emit('acceptOrder', order.id), 5000)
}

function onOrderFulfilled (orderId) {
  console.log(`Order ${orderId} fulfilled`)
}

async function initializeConnection () {
  let socket = io.connect(config.domain)
  let res = await http.getRequest('http', 'json', config.domain, 'restaurant/dummy')
  socket.emit('identify', res.id)
  socket.on('newOrder', order => handleNewOrder(order, socket))
  socket.on('delivererArrivedRestaurant', (orderId, delivererId) => console.log(`${delivererId} waiting to pick up ${orderId}`))
  socket.on('orderPickedUp', onOrderFulfilled)
}

initializeConnection()
