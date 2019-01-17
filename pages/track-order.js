import React, { Component } from 'react'
import { compose } from 'recompose'
import fetch from 'isomorphic-unfetch'
import { withRouter } from 'next/router'
// import Router from 'next/router'

import { withUserContext } from '../Components/Context/UserContextProvider'
import { withCartContext } from '../Components/Context/CartContextProvider'
import keys from '../keys'

class TrackOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mapReceived: false,
      mapURL: '',
      mapRouteURL: ''
    }
    this.mapRequest = this.mapRequest.bind(this)
    this.mapRouteRequest = this.mapRouteRequest.bind(this)
  }
componentDidMount () {
  const restaurantLocation = this.props.cartContext.restaurantAddress
  let locations = []
  locations.push([restaurantLocation.latitude, restaurantLocation.longitude])
  const userLocation = this.props.userContext.userLocation.coords
  locations.push([userLocation.latitude, userLocation.longitude])
  console.log('The final array is ', locations)
  this.mapRequest(locations)
  this.mapRouteRequest(locations[0], locations[1])
}

  mapRequest = locations => {
    locations = locations.map(loc => loc.join(',')).join('||')
    return fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=${keys.mapquest}&locations=${locations}`)
          .then(response => {
            console.log('Map request', response)
            this.setState({
              mapReceived: true,
              mapURL: response.url
            })
          })
  }
  mapRouteRequest = (start, end) => {
    start = start.join(',')
    end = end.join(',')
    return fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=${keys.mapquest}&start=${start}&end=${end}`)
          .then(response => {
            console.log('Map Route request', response)
            this.setState({
              mapRouteURL: response.url
            })
          })
  }

  render () {
    console.log('Tracking props are', this.props)
    if(this.state.mapReceived)
    return (
      <React.Fragment>
        <h2>Track Order</h2>
        <img src={this.state.mapURL} alt='Map image'/>
        <hr />
        <img src={this.state.mapRouteURL} alt='Map route request'/>
      </React.Fragment>)
    else return (
      <h3>No map</h3>
    )
  }
}

export default compose(
  withRouter,
  withUserContext,
  withCartContext
)(TrackOrder)
