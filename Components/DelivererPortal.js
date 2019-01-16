import React from 'react'
import io from 'socket.io-client'
import { Card, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap'

const domain = 'http://localhost:3000'

class DelivererPortal extends React.Component {
  constructor (props) {
    super(props)
    this.state = { orders: [] }
    this.initializeConnection()
  }
  initializeConnection = () => {
    this.socket = io.connect(domain)
    this.socket.emit('identifyDeliverer', this.props.id)
    this.socket.on('newOrder', order => this.setState({ orders: [Object.assign(order, { status: 'new' })].concat(this.state.orders) }))
  }
  acceptDelivery = (orderId) => {
    this.socket.emit('acceptDelivery', this.props.id, orderId)
    let order = Object.assign({}, this.state.orders.filter(order => order.id === orderId)[0])
    order.status = 'accepted'
    this.setState({ orders: [order].concat(this.state.orders.filter(order => order.id !== orderId)) })
  }
  arrivedAtRestaurant = (orderId) => {
    this.socket.emit('arrivedAtRestaurant', orderId)
    let order = Object.assign({}, this.state.orders.filter(order => order.id === orderId)[0])
    order.status = 'arrived'
    this.setState({ orders: [order].concat(this.state.orders.filter(order => order.id !== orderId)) })
  }
  pickedUp = (orderId) => {
    this.socket.emit('pickedUp', orderId)
    let order = Object.assign({}, this.state.orders.filter(order => order.id === orderId)[0])
    order.status = 'pickedUp'
    this.setState({ orders: [order].concat(this.state.orders.filter(order => order.id !== orderId)) })
  }
  delivered = (orderId) => {
    this.socket.emit('delivered', orderId)
    let order = Object.assign({}, this.state.orders.filter(order => order.id === orderId)[0])
    order.status = 'delivered'
    this.setState({ orders: [order].concat(this.state.orders.filter(order => order.id !== orderId)) })
  }
  render () {
    return (
      <div>
      <h2>Deliverer Portal</h2>
        {this.state.orders.map(order => {
          return <DelivererOrderCard
            restaurantName={order.restaurant.name}
            restaurantAddress={order.restaurant.address.value}
            items={order.items}
            status={order.status}
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
        return <Button onClick={() => this.props.acceptDelivery(this.props.id)}>Deliver Order</Button>
      case 'accepted':
        return <Button onClick={() => this.props.arrivedAtRestaurant(this.props.id)}>Arrived at Restaurant</Button>
      case 'arrivedAtRestaurant':
        return <Button onClick={() => this.props.pickedUp(this.props.id)}>Picked Up</Button>
      case 'pickedUp':
        return <Button onClick={() => this.props.delivered(this.props.id)}>Delivered</Button>
      case 'delivered':
        return <p>Order delivered</p>
    }
  }
  render () {
    return (
      <div>
        <Card>
          <CardTitle>{this.props.restaurantName}</CardTitle>
          <CardSubtitle>{this.props.restaurantAddress}</CardSubtitle>
          <CardText>{this.props.items.map(itemType => `${itemType.quantity} ${itemType.item.name}`).join('\n')}</CardText>
          { this.renderButton() }
        </Card>
      </div>
    )
  }
}

export default DelivererPortal
