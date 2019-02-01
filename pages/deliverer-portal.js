import React from 'react'

import DelivererPortal from '../Components/DelivererPortal'
import config from '../config'

class DelivererView extends React.Component {
  constructor () {
    super()
    this.state = {}
  }
  render () {
    return (
      <DelivererPortal id={this.props.id} domain={config.domain} />
    )
  }
}

export default DelivererView
