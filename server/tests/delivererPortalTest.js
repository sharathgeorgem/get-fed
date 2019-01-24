const io = require('socket.io-client')

const http = require('../../utilities/promisifiedHTTP')
const config = require('../../config')

function handleNewOrder (order, id, socket) {
  console.log('New order is', order)
  setTimeout(() => socket.emit('acceptDelivery', id, order.id), 1000)
  setTimeout(() => socket.emit('arrivedAtRestaurant', order.id), 4000)
  setTimeout(() => socket.emit('pickedUp', order.id), 7000)
  setTimeout(() => socket.emit('delivered', order.id), 10000)
}

async function initializeConnection () {
  let socket = io.connect(config.domain)
  let res = await http.getRequest('http', 'json', config.domain, 'deliverer/dummy')
  socket.emit('identifyDeliverer', res.id)
  socket.on('newOrder', order => handleNewOrder(order, res.id, socket))
}

initializeConnection()
