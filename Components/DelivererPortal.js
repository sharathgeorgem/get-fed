import React from 'react'
import io from 'socket.io-client'
import { Card, CardText, CardTitle, CardSubtitle, Input, Button } from 'reactstrap'
import fetch from 'isomorphic-unfetch'

class DelivererPortal extends React.Component {
  constructor (props) {
    super(props)
    this.state = { name: '', id: null, msg: 'Enter your name', orders: [], lat: 0, long: 0, timer: null }
    this.initializeConnection()
  }

  getId = async () => {
    let res = await fetch(`${this.props.domain}/auth/deliverer/${this.state.name}`)
    res = await res.json()
    let id = res.deliverer
    this.setState({ id: id, msg: id ? 'Login successful' : 'Invalid name' }, () => this.socket.emit('identifyDeliverer', this.state.id))
  }

  initializeConnection = () => {
    this.socket = io.connect(this.props.domain)
    this.socket.on('newOrder', order => this.setState({ orders: [Object.assign(order, { status: 'new' })].concat(this.state.orders) }))
  }

  acceptDelivery = (orderId) => {
    this.socket.emit('acceptDelivery', this.state.id, orderId)
    let order = Object.assign({}, this.state.orders.filter(order => order.id === orderId)[0])
    order.status = 'accepted'
    this.setState({
      orders: [order].concat(this.state.orders.filter(order => order.id !== orderId)),
      lat: order.restaurant.address.latitude,
      long: order.restaurant.address.longitude
    })
  }

  simulateDelivery = (order) => {
    const time = 12
    const latDelta = (order.address.latitude - this.state.lat)/time
    const longDelta = (order.address.longitude - this.state.long)/time
    let timer = setInterval(() => this.transmitLocation({ coords: {latitude: this.state.lat + latDelta, longitude: this.state.long + longDelta} }), 5000)
    this.setState({ timer: timer })
  }

  trackDelivery = (order) => {
    let options = {
      enableHighAccuracy: true,
      maximumAge: 0
    }
    let timer = setInterval(() => navigator.geolocation.getCurrentPosition(this.transmitLocation, console.warn, options), 10000)
    this.setState({ timer: timer })
  }

  transmitLocation = (position) => {
    let latDel = position.coords.latitude
    let longDel = position.coords.longitude
    this.setState(
      { lat: latDel, long: longDel },
      () => {
        this.socket.emit('updateLocation', this.state.id, this.state.lat, this.state.long)
      }
    )
  }

  arrivedAtRestaurant = (orderId) => {
    this.socket.emit('arrivedAtRestaurant', orderId)
    let order = Object.assign({}, this.state.orders.filter(order => order.id === orderId)[0])
    order.status = 'arrivedAtRestaurant'
    this.setState({ orders: [order].concat(this.state.orders.filter(order => order.id !== orderId)) })
  }

  pickedUp = (orderId) => {
    this.socket.emit('pickedUp', orderId)
    let order = Object.assign({}, this.state.orders.filter(order => order.id === orderId)[0])
    order.status = 'pickedUp'
    this.setState({ orders: [order].concat(this.state.orders.filter(order => order.id !== orderId)) },
      () => this.trackDelivery(order)) // change to trackDelivery later
  }

  delivered = (orderId) => {
    this.socket.emit('delivered', orderId)
    let order = Object.assign({}, this.state.orders.filter(order => order.id === orderId)[0])
    order.status = 'delivered'
    clearTimeout(this.state.timer)
    this.setState({ orders: [order].concat(this.state.orders.filter(order => order.id !== orderId)), timer: null })
  }

  render () {
    return (
      <div>
      <h2>Deliverer Portal</h2>
      <Input onChange={e => this.setState({ name: e.target.value })} value={this.state.name} placeholder='Enter Name'>Deliverer : </Input>
      <Button onClick={this.getId}>Submit</Button>
      <p>{this.state.msg}</p>
      <hr />
      <h3>Deliveries</h3>
        {this.state.orders.map(order => {
          console.log('Here is where I send the stuff', order.address)
          return <DelivererOrderCard
            key={order.id}
            id={order.id}
            restaurantName={order.restaurant.name}
            restaurantAddress={order.restaurant.address.value}
            items={order.items}
            status={order.status}
            deliverAddress={order.address.value}
            acceptDelivery={this.acceptDelivery}
            arrived={this.arrivedAtRestaurant}
            pickedUp={this.pickedUp}
            delivered={this.delivered}
          />
        })}
      </div>
    )
  }
}

class DelivererOrderCard extends React.Component {
  renderButton = () => {
    switch (this.props.status) {
      case 'new':
        return <Button onClick={() => this.props.acceptDelivery(this.state.id)}>Deliver Order</Button>
      case 'accepted':
        return <Button onClick={() => this.props.arrived(this.state.id)}>Arrived at Restaurant</Button>
      case 'arrivedAtRestaurant':
        return <Button onClick={() => this.props.pickedUp(this.state.id)}>Picked Up</Button>
      case 'pickedUp':
        return <Button onClick={() => this.props.delivered(this.state.id)}>Delivered</Button>
      case 'delivered':
        return <p>Order delivered</p>
    }
  }

  render () {
    console.log('The deliverer order card props are', this.props)
    return (
      <div>
        <Card>
          <CardTitle>{this.props.restaurantName}</CardTitle>
          <CardSubtitle>{this.props.restaurantAddress}</CardSubtitle>
          <CardSubtitle>Deliver to {this.props.deliverAddress}</CardSubtitle>
          <CardText>{this.props.items.map(itemType => `${itemType.quantity} ${itemType.item.name}`).join('\n')}</CardText>
          { this.renderButton() }
        </Card>
      </div>
    )
  }
}

export default DelivererPortal
