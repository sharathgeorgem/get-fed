const mongoose = require('mongoose')
const config = require('../config')

const ObjectId = mongoose.Schema.Types.ObjectId

// Connect to database

mongoose.connect(config.db, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.log)
db.once('open', function () {
  console.log('Mongoose Connected')
})

mongoose.set('useFindAndModify', false) // findAndModify is deprecated but enabled by default

// Schemas

function createSchema (contents) { // wraps all created schemas with id field, which is a copy of _id field
  let schema = new mongoose.Schema(contents)
  schema.virtual('id').get(function () { return this._id })
  schema.set('toObject', { virtuals: true })
  schema.set('toJSON', { virtuals: true })
  return schema
}

const ItemSchema = createSchema({
  name: String,
  description: String,
  price: Number,
  img: String,
  available: Boolean,
  restaurant: { type: ObjectId, ref: 'Restaurant' }
})
const AddressSchema = createSchema({
  latitude: Number,
  longitude: Number,
  value: String,
  apartment: String,
  landmark: String
})
const OrderSchema = createSchema({
  customer: { type: ObjectId, ref: 'User' },
  restaurant: { type: ObjectId, ref: 'Restaurant' },
  items: [{
    item: { type: ObjectId, ref: 'Item' },
    quantity: Number
  }],
  timePlaced: Date,
  accepted: Boolean,
  timeFulfilled: Date,
  timeDelivered: Date,
  deliverer: { type: ObjectId, ref: 'Deliverer' },
  total: Number,
  address: AddressSchema
})
const UserSchema = createSchema({
  name: String,
  cart: [{
    item: { type: ObjectId, ref: 'Item' },
    quantity: Number
  }],
  currentOrders: [{ type: ObjectId, ref: 'Order' }],
  pastOrders: [{ type: ObjectId, ref: 'Order' }],
  addresses: { home: AddressSchema, work: AddressSchema, others: [AddressSchema] }
})
const RestaurantSchema = createSchema({
  name: String,
  address: AddressSchema,
  cost: Number,
  score: Number,
  votes: Number,
  thumb: String,
  img: String,
  cuisines: [String],
  menu: [{
    category: String,
    items: [{ type: ObjectId, ref: 'Item' }]
  }],
  currentOrders: [{ type: ObjectId, ref: 'Order' }],
  pastOrders: [{ type: ObjectId, ref: 'Order' }]
})
RestaurantSchema.virtual('rating').get(function () { return this.score / this.votes })

const DelivererSchema = createSchema({
  name: String,
  score: Number,
  votes: Number,
  currentOrders: [{ type: ObjectId, ref: 'Order' }],
  customers: [{ type: ObjectId, ref: 'User' }]
})

// Models

const Item = mongoose.model('Item', ItemSchema)
const Order = mongoose.model('Order', OrderSchema)
const Address = mongoose.model('Address', AddressSchema)
const User = mongoose.model('User', UserSchema)
const Restaurant = mongoose.model('Restaurant', RestaurantSchema)
const Deliverer = mongoose.model('Deliverer', DelivererSchema)

// Helper functions

function costOfCart (cart) {
  let cost = 0
  for (let itemType of cart) {
    cost += itemType.item.price * itemType.quantity
  }
  return cost
}

// Exported methods

exports.findUser = async function (name) {
  return User.findOne({ name: name })
}

exports.getDummyRestaurant = async function () {
  let restaurants = await Restaurant.find()
  return restaurants[0].id
}

exports.getDummyDeliverer = async function () {
  let deliverers = await Deliverer.find()
  return deliverers[0].id
}

// --- above only for development

exports.addUser = async function (name) {
  let user = new User({ name: name, cart: [], currentOrders: [], pastOrders: [], addresses: { home: {}, work: {}, others: [] } })
  return user.save()
}

exports.addRestaurant = async function (restaurantDetails) {
  let address = new Address(restaurantDetails.address)
  let restaurant = new Restaurant({
    name: restaurantDetails.name,
    address: address,
    cost: restaurantDetails.cost,
    score: restaurantDetails.score,
    votes: restaurantDetails.votes,
    cuisines: restaurantDetails.cuisines,
    thumb: restaurantDetails.thumb,
    img: restaurantDetails.img,
    menu: [],
    currentOrders: [],
    pastOrders: []
  })
  return restaurant.save()
}

exports.addDeliverer = async function (name) {
  let deliverer = new Deliverer({ name: name, score: 0, votes: 0, currentOrders: [] })
  return deliverer.save()
}

exports.addItem = async function (resId, itemDetails, category) {
  let item = new Item(itemDetails)
  await item.save()
  let restaurant = await Restaurant.findById(resId)
  let index = restaurant.menu.findIndex(val => val.category === category)
  if (index >= 0) {
    restaurant.menu[index].items.push(item.id)
  } else restaurant.menu.push({ category: category, items: [item.id] })
  await restaurant.save()
  return item
}

exports.getRestaurants = async function () {
  return Restaurant.find()
}

exports.getMenu = async function (resId) {
  return Restaurant.findById(resId).populate('menu.items')
}

exports.getCart = async function (userId) {
  let res = await User.findById(userId).populate('cart.item')
  return { cart: res.cart, total: costOfCart(res.cart) }
}

exports.getAddresses = async function (userId) {
  let res = await User.findById(userId)
  return res.addresses
}

exports.getDelivererName = async function (delivererId) {
  let res = await Deliverer.findById(delivererId)
  return res.name
}

exports.getOrderDetails = async function (orderId) {
  return Order.findById(orderId).populate('items.item')
}

exports.addToCart = async function (userId, item) {
  let user = await User.findById(userId)
  let index = user.cart.findIndex(itemType => itemType.item.toString() === item)
  if (index < 0) {
    user.cart.push({ item: item, quantity: 1 })
  } else {
    user.cart[index].quantity++
  }
  await user.save()
  user = await User.findById(userId).populate('cart.item')
  return { cart: user.cart, total: costOfCart(user.cart) }
}

exports.removeFromCart = async function (userId, item) {
  let user = await User.findById(userId)
  let index = user.cart.findIndex(itemType => itemType.item.toString() === item)
  if (user.cart[index].quantity > 1) {
    user.cart[index].quantity--
  } else {
    user.cart.splice(index, 1)
  }
  await user.save()
  user = await User.findById(userId).populate('cart.item')
  return { cart: user.cart, total: costOfCart(user.cart) }
}

exports.setCart = async function (userId, cartContents) {
  let user = await User.findOneAndUpdate({ _id: userId }, { cart: cartContents }, { new: true }).populate('cart.item')
  return { cart: user.cart, total: costOfCart(user.cart) }
}

exports.addAddress = async function (userId, addressType, addressDetails) {
  let address = new Address(addressDetails)
  await address.save()
  let user = await User.findById(userId)
  if (addressType === 'home' || addressType === 'work') {
    user.addresses[addressType] = address
  } else user.addresses.others.push(address)
  let res = await user.save()
  return res.addresses // needs to return the populated address schema
}

exports.submitOrder = async function (userId, address) {
  let user = await User.findById(userId).populate('cart.item')
  let price = costOfCart(user.cart)
  address = new Address(address) // check
  let cart = user.cart.map(itemType => Object.assign({}, { item: itemType.item._id, quantity: itemType.quantity }))
  let restaurantId = user.cart[0].item.restaurant
  let order = new Order({ customer: userId, restaurant: restaurantId, items: cart, timePlaced: Date.now(), accepted: false, total: price, address: address })
  order = await order.save()
  order = await Order.findById(order.id).populate('items.item')

  user.cart = []
  user.currentOrders.push(order)
  user = await user.save()

  let restaurant = await Restaurant.findById(restaurantId)
  restaurant.currentOrders.push(order)
  restaurant = await restaurant.save()

  return order
}

exports.cancelOrder = async function (orderId) {
  let order = await Order.findById(orderId)
  if (order.accepted) return false

  let user = await User.findById(order.customer)
  user.currentOrders.splice(user.currentOrders.findIndex(order => order.toString() === orderId), 1)
  await user.save()

  let restaurant = await Restaurant.findById(order.restaurant)
  restaurant.currentOrders.splice(restaurant.currentOrders.findIndex(order => order.toString() === orderId), 1)
  await restaurant.save()

  return order.restaurant
}

exports.getCustomers = async function (delivererId) {
  let deliverer = await Deliverer.findById(delivererId)
  return deliverer.customers
}

exports.acceptOrder = async function (orderId) {
  return Order.findOneAndUpdate({ _id: orderId }, { accepted: true }, { new: true }).populate('items.item restaurant')
}

exports.acceptDelivery = async function (delivererId, orderId) {
  let order = await Order.findById(orderId)
  if (order.deliverer) return false
  order.deliverer = delivererId
  order.save()
  let deliverer = await Deliverer.findById(delivererId)
  deliverer.currentOrders.push(orderId)
  deliverer.customers.push(order.customer)
  deliverer.save()
  return { customer: order.customer, deliverer: deliverer.name }
}

exports.pickedUp = async function (orderId) {
  let order = await Order.findOneAndUpdate({ _id: orderId }, { timeFulfilled: Date.now() }, { new: true }).populate('items.item')
  let restaurant = await Restaurant.findById(order.restaurant)
  restaurant.currentOrders.splice(restaurant.currentOrders.indexOf(orderId), 1)
  restaurant.pastOrders.push(order)
  await restaurant.save()
  return order
}

exports.delivered = async function (orderId) {
  let order = await Order.findOneAndUpdate({ _id: orderId }, { timeDelivered: Date.now() }, { new: true })
  let user = await User.findById(order.customer)
  user.currentOrders.splice(user.currentOrders.indexOf(orderId), 1)
  user.pastOrders.push(order)
  await user.save()

  let deliverer = await Deliverer.findById(order.deliverer)
  deliverer.currentOrders.splice(deliverer.currentOrders.indexOf(orderId), 1)
  deliverer.customers.splice(deliverer.customers.indexOf(order.customer), 1)
  await deliverer.save()

  return order
}
