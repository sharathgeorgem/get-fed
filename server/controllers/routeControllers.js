const model = require('../model')
const bcrypt = require('bcrypt')

exports.getDummyRestaurant = async function (req, res) {
  let result = await model.getDummyRestaurant().catch(console.log)
  res.send({ id: result })
}

exports.getDummyDeliverer = async function (req, res) {
  let result = await model.getDummyDeliverer().catch(console.log)
  res.send({ id: result })
}

exports.addRestaurant = async function (req, res) {
  let result = await model.addRestaurant(req.body).catch(console.log)
  res.send(result)
}

exports.addDeliverer = async function (req, res) {
  let result = await model.addDeliverer(req.body.name).catch(console.log)
  res.send(result)
}

exports.addItem = async function (req, res) {
  let result = await model.addItem(req.params.restaurantId, req.body.item, req.body.category).catch(console.log)
  res.send(result)
}

exports.getAllRestaurants = async function (req, res) {
  let result = await model.getAllRestaurants()
  res.send(result)
}

exports.getRestaurants = async function (req, res) {
  let result = await model.getRestaurants(req.params.latitude, req.params.longitude).catch(console.log)
  res.send(result)
}

exports.getMenu = async function (req, res) {
  let menu = await model.getMenu(req.params.restaurantId).catch(console.log)
  res.send(menu)
}

exports.getCart = async function (req, res) {
  let cart = await model.getCart(req.params.userId).catch(console.log)
  res.send(cart)
}

exports.getAddresses = async function (req, res) {
  let result = await model.getAddresses(req.params.userId).catch(console.log)
  res.send({ addresses: result })
}

exports.addItemToCart = async function (req, res) {
  let cart = await model.addToCart(req.params.userId, req.params.itemId).catch(console.log)
  res.send(cart)
}

exports.removeItemFromCart = async function (req, res) {
  let cart = await model.removeFromCart(req.params.userId, req.params.itemId).catch(console.log)
  res.send(cart)
}

exports.addAddress = async function (req, res) {
  let address = await model.addAddress(req.params.userId, req.params.addressType, req.body.address).catch(console.log)
  res.send({ addresses: address })
}

exports.setCart = async function (req, res) {
  let cart = await model.setCart(req.params.userId, req.body.cart).catch(console.log)
  res.send(cart)
}

exports.register = async function (req, res) {
  let user = null
  let existingUser = await model.findUserByName(req.body.username)
  if (existingUser === null) {
    let hash = await bcrypt.hash(req.body.password, 10)
    user = await model.addUser(req.body.username, hash).catch(console.log)
  }
  res.send({ result: !!user })
}

exports.loginRestaurant = async function (req, res) {
  let restaurant = await model.findRestaurant(req.params.name).catch(console.log)
  res.send({ restaurant: restaurant ? restaurant._id : null })
}

exports.loginDeliverer = async function (req, res) {
  let deliverer = await model.findDeliverer(req.params.name).catch(console.log)
  res.send({ deliverer: deliverer ? deliverer._id : null })
}
