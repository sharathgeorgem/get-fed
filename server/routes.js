const express = require('express')

const controllers = require('./controllers/routeControllers')

const router = express.Router()

// only for development
router.get('/dev/restaurant/dummy', controllers.getDummyRestaurant)
router.get('/dev/deliverer/dummy', controllers.getDummyDeliverer)
router.get('/dev/restaurant/all', controllers.getAllRestaurants)
// ---

// for adding initial data in db
router.post('/restaurant/new', controllers.addRestaurant)
router.post('/deliverer/new', controllers.addDeliverer)
router.post('/menu/new/:restaurantId', controllers.addItem)
// ---

router.get('/restaurant/:latitude/:longitude', controllers.getRestaurants)
router.get('/menu/:restaurantId', controllers.getMenu)
router.get('/user/cart/:userId', controllers.getCart)
router.get('/user/addresses/:userId', controllers.getAddresses)
router.put('/user/cart/:userId/:itemId', controllers.addItemToCart)
router.delete('/user/cart/:userId/:itemId', controllers.removeItemFromCart)
router.put('/user/addresses/:userId/:addressType', controllers.addAddress) // send address in body
router.post('/user/cart/:userId', controllers.setCart) // send cart in body

router.post('/auth/register', controllers.register)
router.get('/restaurant/login/:name', controllers.loginRestaurant)
router.get('/deliverer/login/:name', controllers.loginDeliverer)

module.exports = router
