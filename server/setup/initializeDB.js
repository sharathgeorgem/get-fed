const http = require('../../utilities/promisifiedHTTP')
const config = require('../../config')

const images = {
  wine: 'http://i.pinimg.com/736x/3b/68/82/3b688219528458e3eb06783c05c9f22f.jpg',
  coffee: 'http://www.walkaboutflorence.com/sites/default/files/styles/news_detail/public/Coffee_Caffe__Cappuccino_Latte_Florence_Italy.jpg',
  beer: 'https://www.underconsideration.com/brandnew/archives/heineken_00_hero_shot_02.jpg',
  lemonade: 'https://www.domechan.com/shop/1424-thickbox_default/ramune-working-lemonade-japanese-taste-pineapple-200-ml.jpg',
  milk: 'http://betterhousekeeper.com/wp-content/uploads/2014/05/bottle-and-glass-of-milk.jpg',
  chocolate: 'http://www.chocablog.com/wp-content/uploads/2008/09/chocolat-bonnat-2.jpg',
  cornet: 'https://images.japancentre.com/images/pics/12217/large/3566-chocolate-cornet-side.jpg?1469571297',
  banana: 'https://img-global.cpcdn.com/001_recipes/5325406057005056/640x640sq70/photo.jpg',
  potatoes: 'http://justhungry.com/files/images/shinjagashouyubutter.jpg',
  sorbet: 'http://tendingmygarden.com/wp-content/uploads/2010/08/L1690384tomsherbet-in-small-crystal.png',
  lemonpie: 'https://www.kcet.org/sites/kl/files/atoms/article_atoms/www.kcet.org/living/food/assets/images/lemonchiffonpie.png',
  cake: 'https://i.kym-cdn.com/photos/images/original/000/115/357/portal-cake.jpg',
  pumpkinpie: 'http://comicpoplibrary.com/wp-content/uploads/2011/06/herring-and-pumpkin-pie.jpg',
  omurice: 'https://sociorocketnewsen.files.wordpress.com/2014/06/kr-7.png',
  curry: 'https://japanesecurry.weebly.com/uploads/1/4/6/5/14652372/5502478_orig.jpg?0',
  pizza: 'http://2.bp.blogspot.com/_Vh8ATwGRVqo/SvACUfs2A-I/AAAAAAAAKVk/KHyl0oKRNRA/s320/happy+pizza.JPG'
}

async function addDeliverer (name) {
  return http.request('http', 'POST', config.domain, 'deliverer/new', { name: name })
}

async function getRestaurantIds () {
  let restaurants = await http.getRequest('http', 'json', config.domain, 'restaurant')
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
