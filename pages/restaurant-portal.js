import React from 'react'
import fetch from 'isomorphic-unfetch'

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
  let res = await fetch(`${domain}/restaurant/dummy`)
    .then(res => res.json())
  console.log('id is', res.id)
  return { id: res.id }
}

export default RestaurantView
