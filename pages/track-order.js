import React, { Component } from 'react'
import { compose } from 'recompose'
import fetch from 'isomorphic-unfetch'
import { withRouter } from 'next/router'
import io from 'socket.io-client'
// import Router from 'next/router'
import { Button } from 'reactstrap'

import { withUserContext } from '../Components/Context/UserContextProvider'
import { withCartContext } from '../Components/Context/CartContextProvider'
import keys from '../keys'

class TrackOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mapReceived: false,
      mapURL: '',
      mapRouteURL: '',
      orderStatus: 'Awaiting restaurant confirmation',
      delivererCoords: [0, 0]
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

  this.props.userContext.socket.emit('identify', this.props.userContext.userId)

  this.props.userContext.socket.on('orderAccepted', () => this.setState({ orderStatus: 'Order Confirmed' }))
  this.props.userContext.socket.on('delivererAssigned', (id, deliverer) => this.setState({ orderStatus: 'Manjunath is on his way to the restaurant' }, console.log('Deliverer is', deliverer)))
  this.props.userContext.socket.on('delivererArrivedRestaurant', () => this.setState({ orderStatus: 'Manjunath has arrived at the restaurant' }))
  this.props.userContext.socket.on('orderPickedUp', () => this.setState({ orderStatus: 'Order picked up, tasty food is on its way!' }))
  this.props.userContext.socket.on('orderDelivered', () => this.setState({ orderStatus: 'Your order has been delivered, enjoy!' }))
  this.props.userContext.socket.on('updateLocation', coords => {
    this.setState({
      delivererCoords: coords
    }, () => this.mapRouteRequest(this.state.delivererCoords, locations[1]))
  })
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
  cancelOrder = () => {
    this.props.userContext.socket.emit('cancel', this.props.userContext.userId)
  }
  render () {
    console.log('Tracking props are', this.props)
    console.log('The tracked deliverer co-ordinates are ', this.state.delivererCoords)
    if(this.state.mapReceived)
    return (
      <React.Fragment>
        <style jsx global>
          {`
            .img-container {
              background-color: #ffffff;
              animation: loading 1.3s ease-in-out infinite;
              -webkit-animation: loading 1.3s ease-in-out infinite;
            }
            @keyframes loading {
              0% { background-color: #00C9A7; }
              50% { background-color: #C4FCEF; }
              100% { background-color: #4D8076; }
            }
          `}
        </style>
        <h2>Track Order</h2>
        <div className='img-container' style={{height: 400, width: 400}}>
          <img src={this.state.mapURL} alt='Map image'/>
        </div>
        <h4>{this.state.orderStatus}</h4>
        <Button onClick={() => this.cancelOrder()}>Cancel Order</Button>
        <hr />
        <div className='img-container' style={{height: 400, width: 400}}>
          <img src={this.state.mapRouteURL} alt='Map route request'/>
        </div>
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
