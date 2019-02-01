import React from 'react'

import RestaurantPortal from '../Components/RestaurantPortal'
import config from '../config'

class RestaurantView extends React.Component {
  constructor () {
    super()
    this.state = {}
  }
  render () {
    return (
      <RestaurantPortal id={this.props.id} domain={config.domain} />
    )
  }
}

export default RestaurantView
