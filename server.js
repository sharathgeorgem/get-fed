const express = require('express')
const cors = require('cors')
const io = require('socket.io')
const next = require('next')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const config = require('./config')
const router = require('./server/routes')
const model = require('./server/model')
const eventControllers = require('./server/controllers/eventControllers')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const port = process.env.PORT || 3000

// Passport Configuration
passport.use(new Strategy(
  function (username, password, cb) {
    model.findUserByName(username)
      .then(user => {
        if (user === null) { return cb(null, false) }
        bcrypt.compare(password, user.password)
          .then(res => res ? cb(null, user) : cb(null, false))
      })
      .catch(cb)
  }
))

passport.serializeUser(function (user, cb) {
  cb(null, user._id)
})

passport.deserializeUser(function (id, cb) {
  model.findUserById(id)
    .then(user => cb(null, user))
    .catch(cb)
})

// -----

nextApp.prepare()
  .then(() => {
    const app = express()

    const store = new MongoDBStore({
      uri: config.db,
      collection: 'sessions'
    })

    store.on('error', console.log)

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(session({ secret: 'Gettin chwiggy with it', cookie: { httpOnly: false }, store: store, resave: false, saveUninitialized: false }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use('/', router)

    app.get('/authenticate', (req, res) => {
      console.log('Authentication page refresh')
      const actualPage = '/authenticate'
      return nextApp.render(req, res, actualPage)
    })

    app.get('/restaurant-scaffold', (req, res) => {
      const actualPage = '/restaurant-scaffold'
      console.log('Request for restaurants reached')
      console.log('User ID', req.session.passport.user)
      res.session.passport.user = req.session.passport.user
      // console.log('The request is ', req)
      // console.log('The response is ', res)
      // console.log('The actualPage is ', actualPage)
      return nextApp.render(req, res, actualPage)
    })

    app.get('/restaurant/:id', (req, res) => {
      console.log('Request for menu reached')
      const actualPage = '/restaurant'
      const queryParams = { id: req.params.id }
      console.log('The actual page is ', actualPage)
      console.log('Query params are ', queryParams)
      return nextApp.render(req, res, actualPage, queryParams)
    })

    app.get('/restaurant-portal', (req, res) => {
      let restaurantPage = '/restaurant-portal'
      console.log('Request for restaurant portal')
      return nextApp.render(req, res, restaurantPage)
    })

    app.get('/deliverer-portal', (req, res) => {
      let delivererPage = '/deliverer-portal'
      console.log('Request for deliverer portal')
      return nextApp.render(req, res, delivererPage)
    })

    app.get('/_error', (req, res) => {
      console.log('The request parameters are ', req.params)
      let errorPage = '/_error'
      console.log('Error page reached')
      return nextApp.render(req, res, errorPage)
    })

    app.get('*', (req, res) => {
      return handle(req, res)
    })

    app.post('/auth/login',
      passport.authenticate('local'),
      function (req, res) {
        res.send({ result: req.user })
      }
    )

    const server = app.listen(port, function (err) {
      if (err) throw err
      console.log(`Server listening on port ${port}`)
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
      client.emit('confirmConnection')
      client.on('identify', id => addConnection(id, client))
      client.on('identifyDeliverer', id => addDeliverer(id, client))
      client.on('placeOrder', (userId, addressId) => eventControllers.placeOrder(userId, addressId, connections))
      client.on('acceptOrder', (orderId) => eventControllers.acceptOrder(orderId, connections))
      client.on('acceptDelivery', (delivererId, orderId) => eventControllers.acceptDelivery(delivererId, orderId, connections))
      client.on('arrivedAtRestaurant', (orderId) => eventControllers.arrivedRestaurant(orderId, connections))
      client.on('pickedUp', (orderId) => eventControllers.pickedUp(orderId, connections))
      client.on('delivered', (orderId) => eventControllers.delivered(orderId, connections))
      client.on('updateLocation', (delivererId, lat, long) => eventControllers.updateLocation(delivererId, lat, long, connections))
      client.on('cancel', (orderId) => eventControllers.cancelOrder(orderId, client, connections))
    })
  })
  .catch((ex) => {
    console.log(ex.stack)
    process.exit(1)
  })
