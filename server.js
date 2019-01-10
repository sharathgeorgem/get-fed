const express = require('express')
const cors = require('cors')
const io = require('socket.io')
const next = require('next')

const router = require('./server/routes')
const eventControllers = require('./server/controllers/eventControllers')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const port = process.env.PORT || 3000

nextApp.prepare()
  .then(() => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use('/', router)

    const server = app.listen(port, function (err) {
      if (err) throw err
      console.log(`Server listening on port ${port}`)
    })

    app.get('*', (req, res) => {
      return handle(req, res)
    })

    let serverSocket = io.listen(server)

    var connections = {
      deliverers: {}
    }

    function addConnection (id, client) {
      connections[id] = client
    }

    function addDeliverer (id, client) {
      connections.deliverers[id] = { socket: client, latitude: 0, longitude: 0 }
    }

    serverSocket.on('connection', client => {
      console.log('Connection made')
      client.on('identify', id => addConnection(id, client))
      client.on('identifyDeliverer', id => addDeliverer(id, client))
      client.on('placeOrder', (userId, addressId) => eventControllers.placeOrder(userId, addressId, connections))
      client.on('acceptOrder', (orderId) => eventControllers.acceptOrder(orderId, connections))
      client.on('acceptDelivery', (delivererId, orderId) => eventControllers.acceptDelivery(delivererId, orderId, connections))
      client.on('arrivedAtRestaurant', (orderId) => eventControllers.arrivedRestaurant(orderId, connections))
      client.on('pickedUp', (orderId) => eventControllers.pickedUp(orderId, connections))
      client.on('delivered', (orderId) => eventControllers.delivered(orderId, connections))
      client.on('updateLocation', (delivererId, lat, long) => eventControllers.updateLocation(delivererId, lat, long, connections))
    })
  })
  .catch((ex) => {
    console.log(ex.stack)
    process.exit(1)
  })
