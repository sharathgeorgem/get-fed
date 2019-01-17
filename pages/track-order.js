import React, { Component } from 'react'
import { compose } from 'recompose'
import fetch from 'isomorphic-unfetch'
import { withRouter } from 'next/router'
// import Router from 'next/router'

import { withUserContext } from '../Components/Context/UserContextProvider'
import { withCartContext } from '../Components/Context/CartContextProvider'
import keys from '../keys'

function mapRequest (locations) { // takes an array of array of lat/long
  locations = locations.map(loc => loc.join(',')).join('||')
  return fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=${keys.mapquest}&locations=${locations}`)
}

function mapRouteRequest (start, end) {
  start = start.join(',')
  end = end.join(',')
  return fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=${keys.mapquest}&start=${start}&end=${end}`)
}

class TrackOrder extends Component {
  render () {
    console.log('Tracking props are', this.props)
    return (
      <h2>Track Order</h2>
    )
  }
}

export default compose(
  withRouter,
  withUserContext,
  withCartContext
)(TrackOrder)
