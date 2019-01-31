const http = require('../../utilities/promisifiedHTTP')
const config = require('../../config')

const images = {
  wine: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/redredwine.jpg',
  coffee: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/coffee.jpg',
  beer: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/heineken.jpg',
  lemonade: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/ramune.jpg',
  milk: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/milk.jpg',
  chocolate: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/chocolate.jpg',
  cornet: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/choco_cornet.jpg',
  banana: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/banana.jpg',
  potatoes: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/buttered_potatoes.jpg',
  sorbet: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/tomato_sherbet.jpg',
  lemonpie: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/lemonchiffonpie.jpg',
  cake: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/portal-cake.jpg',
  pumpkinpie: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/herring-and-pumpkin-pie.jpg',
  omurice: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/omurice.jpg',
  curry: 'https://res.cloudinary.com/geekskool/image/upload/v1548926622/get-fed/choco_curry.jpg',
  pizza: 'https://res.cloudinary.com/geekskool/image/upload/v1548926660/get-fed/happy_pizza.jpg'
}

async function addDeliverer (name) {
  return http.request('http', 'POST', config.domain, 'deliverer/new', { name: name })
}

async function getRestaurantIds () {
  console.log('Lets get restaurants') // debug
  let restaurants = await http.getRequest('http', 'json', config.domain, 'dev/restaurant/all')
  return restaurants.map(res => res.id)
}

async function addItem (resId, details, category) {
  return http.request('http', 'POST', config.domain, `menu/new/${resId}`, { item: details, category: category })
}

async function setupDummyData () {
  addDeliverer('Jadesh Shetty')
  addDeliverer('Manjunath')
  let ids = await getRestaurantIds()
  ids.forEach(addMenu)
}

async function addMenu (resId) {
  await addMenuItem('Red Red Wine', 'Goes to your head', 400, images.wine, true, resId, 'Beverages')
  await addMenuItem('Coffee', 'Pa pa ra pa pa ra ra, pa pa ra pa pa ra ra - Nescafe!', 50, images.coffee, true, resId, 'Beverages')
  await addMenuItem('Heineken', 'Probably the best beer in the world', 300, images.beer, true, resId, 'Beverages')
  await addMenuItem('Ramune', 'Finely aged for the better part of a decade', 73, images.lemonade, true, resId, 'Beverages')
  await addMenuItem('Milk', 'Piyo glassful Doodh hai must in every season, Piyo doodh for healthy reason', 40, images.milk, true, resId, 'Beverages')
  await addMenuItem("Maulik's Chocolate", '100% Cocoa', 150, images.chocolate, true, resId, 'Snacks')
  await addMenuItem('Choco Cornet', 'Which side will YOU eat it from?', 125, images.cornet, true, resId, 'Snacks')
  await addMenuItem('Microwaved Banana', 'Delivered from the future just for you', 25, images.banana, true, resId, 'Snacks')
  await addMenuItem('Soy Buttered Potatoes', '', 50, images.potatoes, true, resId, 'Snacks')
  await addMenuItem('Cheese Lemon Custard Chiffon Pie', 'Now with separate custard cream and cheese lemon chiffon layers!', 225, images.lemonpie, true, resId, 'Dessert')
  await addMenuItem('Tomato Sorbet', 'Made with leftover fresh garden tomatoes', 125, images.sorbet, true, resId, 'Dessert')
  await addMenuItem('The Cake', '...is a lie', 750, images.cake, false, resId, 'Dessert')
  await addMenuItem('Herring and Pumpkin Pie', "Grandma's secret recipe", 650, images.pumpkinpie, true, resId, 'Dessert')
  await addMenuItem('Omurice', 'Omelette rice with ketchup. Made with love!', 100, images.omurice, true, resId, 'Main Courses')
  await addMenuItem('Chocolate Curry Rice', 'Made with beloved turmeric, green jalapenos, cinnamon & cardamom, impossible paprika, green coriander, and now garam masala. We present to you delicious curry!', 300, images.curry, true, resId, 'Main Courses')
  await addMenuItem('Happy Pizza', 'Not legal in all territories. Conditions apply. Happiness not guaranteed.', 200, images.pizza, true, resId, 'Main Courses')
}

function addMenuItem (name, description, price, img, available, id, category) {
  return addItem(id, {
    name: name,
    description: description,
    price: price,
    img: img,
    available: available,
    restaurant: id
  }, category)
}

setupDummyData()
