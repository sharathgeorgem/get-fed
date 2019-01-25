import React from 'react'
import io from 'socket.io-client'
import { Card, CardText, CardTitle, CardSubtitle, Button } from 'reactstrap'

import config from '../config'

class RestaurantPortal extends React.Component {
  constructor (props) {
    super(props)
    this.state = { orders: [] }
    this.initializeConnection()
  }
  initializeConnection = () => {
    this.socket = io.connect(config.domain)
    this.socket.emit('identify', this.props.id)
    this.socket.on('newOrder', order => this.setState({ orders: [order].concat(this.state.orders) }))
    this.socket.on('updateOrderStatus', order => this.setState(
      { orders: [order].concat(this.state.orders.filter(oldOrder => oldOrder.id !== order.id)) },
      () => console.log('Updated') ))
    this.socket.on('cancel', id => this.setState(
      { orders: this.state.orders.filter(order => order.id !== id) }
    ))
  }
  acceptOrder = (orderId) => {
    this.socket.emit('acceptOrder', orderId)
  }
  render () {
    return (
      <div>
      <h2>Restaurant Portal</h2>
      <hr />
      <h3>Orders</h3>
        {this.state.orders.filter(order => !order.accepted).map(order => {
          return <RestaurantOrderCard
          key={order.id}
          id={order.id}
          timePlaced={new Date(order.timePlaced).toLocaleTimeString()}
          customerAddress={order.address.value}
          items={order.items}
          accepted={false}
          acceptOrder={this.acceptOrder}
          />
        })}
        { this.state.orders.length > 0 ? <hr /> : null}
        {this.state.orders.filter(order => order.accepted).map(order => {
          return <RestaurantOrderCard
            key={order.id}
            id={order.id}
            timePlaced={new Date(order.timePlaced).toLocaleTimeString()}
            customerAddress={order.address.value}
            items={order.items}
            accepted={true}
            acceptOrder={this.acceptOrder}
            deliverer={order.deliverer}
            timeFulfilled={order.timeFulfilled}
            />
        })}
      </div>
    )
  }
}

class RestaurantOrderCard extends React.Component {
  progressMessage () {
    if (this.props.timeFulfilled) {
      return <CardText>Order Fulfilled</CardText>
    }
    if (this.props.deliverer) {
      return <CardText>{this.props.deliverer.name} waiting to pick up order...</CardText>
    }
    if (this.props.accepted) {
      return <CardText>Order Accepted</CardText>
    }
    return <Button onClick={() => this.props.acceptOrder(this.props.id)}>Accept Order</Button>
  }
  render () {
    return (
      <div>
        <Card>
          <CardText>Time Placed: {this.props.timePlaced}</CardText>
          <CardText>Customer Address: {this.props.customerAddress}</CardText>
          <CardText>Items: {this.props.items.map(itemType => `${itemType.quantity} ${itemType.item.name}`).join('\n')}</CardText>
          { this.progressMessage() }
        </Card>
      </div>
    )
  }
}

export default RestaurantPortal
