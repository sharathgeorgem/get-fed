import React, { Component } from 'react'
import { compose } from 'recompose'
import fetch from 'isomorphic-unfetch'
import { withRouter } from 'next/router'
import { Button, Progress } from 'reactstrap'

import { withUserContext } from '../Components/Context/UserContextProvider'
import { withCartContext } from '../Components/Context/CartContextProvider'
import config from '../config'

const orderStatusMessages = {
  0: 'Awaiting restaurant confirmation',
  1: 'Order Confirmed',
  2: 'Manjunath is on his way to the restaurant',
  3: 'Manjunath has arrived at the restaurant',
  4: 'Order picked up, tasty food is on its way!',
  5: 'Your order has been delivered, enjoy!'
}

class TrackOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mapReceived: false,
      mapURL: '',
      mapRouteURL: '',
      orderStatus: '0',
      deliverer: '',
      delivererCoords: [0, 0]
    }
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

    this.props.userContext.socket.on('cancelConfirmed', () => this.setState({ orderStatus: 'Order Cancelled' }))
    this.props.userContext.socket.on('orderAccepted', () => this.setState({ orderStatus: '1' }))
    this.props.userContext.socket.on('delivererAssigned', (id, deliverer) => this.setState({ orderStatus: '2', deliverer: deliverer }, console.log('Deliverer is', deliverer)))
    this.props.userContext.socket.on('delivererArrivedRestaurant', () => this.setState({ orderStatus: '3' }))
    this.props.userContext.socket.on('orderPickedUp', () => this.setState({ orderStatus: '4' }))
    this.props.userContext.socket.on('orderDelivered', () => this.setState({ orderStatus: '5' }))
    this.props.userContext.socket.on('updateLocation', coords => {
      this.setState({
        delivererCoords: coords
      }, () => this.mapRouteRequest(this.state.delivererCoords, locations[1]))
    })
  }

  mapRequest = locations => {
    locations = locations.map(loc => loc.join(',')).join('||')
    return fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=${config.mapquestKey}&locations=${locations}`)
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
    return fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=${config.mapquestKey}&start=${start}&end=${end}`)
          .then(response => {
            console.log('Map Route request', response)
            this.setState({
              mapRouteURL: response.url
            })
          })
  }

  cancelOrder = () => {
    this.props.userContext.socket.emit('cancel', this.props.cartContext.orderId)
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
        {(this.state.orderStatus * 20) > 80
        ? <Progress animated color="success" value={(this.state.orderStatus * 20)} />
        : <Progress animated color="warning" value={(this.state.orderStatus * 20)} />
        }
        <h4>{orderStatusMessages[this.state.orderStatus]}</h4>
        { this.state.orderStatus==='0'
        ? <Button onClick={() => this.cancelOrder()}>Cancel Order</Button>
        : null }
        <hr />
        <div className='img-container' style={{height: 400, width: 400}}>
          <img src={this.state.mapRouteURL} alt='Map route request'/>
        </div>
      </React.Fragment>)
    else return (
      <h3>No map</h3> // put spinner here
    )
  }
}

export default compose(
  withRouter,
  withUserContext,
  withCartContext
)(TrackOrder)
