import React from 'react'

import http from '../utilities/promisifiedHTTP'
import RestaurantPortal from '../Components/RestaurantPortal'

const domain = 'http://localhost:3000'

class RestaurantView extends React.Component {
  constructor () {
    super()
    this.state = {}
  }
  render () {
    return (
      <RestaurantPortal id={this.props.id} />
    )
  }
}

RestaurantView.getInitialProps = async function () {
  let res = await http.getRequest('http', 'json', domain, 'restaurant/dummy')
  console.log('id is', res.id)
  return { id: res.id }
}

export default RestaurantView
