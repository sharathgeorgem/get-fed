import React from 'react'

import fetch from 'isomorphic-unfetch'
import DelivererPortal from '../Components/DelivererPortal'

const domain = 'http://localhost:3000'

class DelivererView extends React.Component {
  constructor () {
    super()
    this.state = {}
  }
  render () {
    return (
      <DelivererPortal id={this.props.id} />
    )
  }
}

DelivererView.getInitialProps = async function () {
  let res = await fetch(`${domain}/deliverer/dummy`)
    .then(res => res.json())
  console.log('id is', res.id)
  return { id: res.id }
}

export default DelivererView
