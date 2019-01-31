const prod = process.env.NODE_ENV === 'production'

module.exports = {
  // publicRuntimeConfig: { // Will be available on both server and client
  //   domain: 'http://localhost:3000',
  //   database: 'mongodb+srv://admin:chwiggy@get-fed-2q8ne.mongodb.net/test?retryWrites=true',
  //   mapquestKey: 'GFf1LiiyRhj0zRd4UBrVzlmr7fUOjUvu'
  // }
  'process.env.DOMAIN': prod ? 'https://get-fed.herokuapp.com' : 'http://localhost:3000',
  'process.env.DATABASE': 'mongodb+srv://admin:chwiggy@get-fed-2q8ne.mongodb.net/test?retryWrites=true',
  'process.env.MAPQUEST_API_KEY': 'GFf1LiiyRhj0zRd4UBrVzlmr7fUOjUvu'
}
