import React from 'react'
import io from 'socket.io-client'
import { Card, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap'

const domain = 'http://localhost:3000'

class RestaurantPortal extends React.Component {
  constructor (props) {
    super(props)
    this.state = { orders: [] }
    this.initializeConnection()
  }
  initializeConnection = () => {
    this.socket = io.connect(domain)
    this.socket.emit('identify', this.props.id)
    this.socket.on('newOrder', order => this.setState({ orders: [order].concat(this.state.orders) }))
    this.socket.on('updateOrderStatus', order => this.setState(
      { orders: [order].concat(this.state.orders.filter(oldOrder => oldOrder.id !== order.id)) },
      () => console.log('Updated') ))
  }
  acceptOrder = (orderId) => {
    this.socket.emit('acceptOrder', orderId)
  }
  render () {
    return (
      <div>
      <h2>Restaurant Portal</h2>
        {this.state.orders.filter(order => !order.accepted).map(order => {
          return <RestaurantOrderCard
          key={order.id}
          id={order.id}
          timePlaced={order.timePlaced}
          items={order.items}
          accepted={false}
          acceptOrder={this.acceptOrder}
          />
        })}
        <hr />
        {this.state.orders.filter(order => order.accepted).map(order => {
          return <RestaurantOrderCard
            key={order.id}
            id={order.id}
            timePlaced={order.timePlaced}
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
      return <CardText>{this.props.deliverer} waiting to pick up order...</CardText>
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
          <CardTitle>{this.props.timePlaced}</CardTitle>
          <CardSubtitle>{this.props.customerAddress}</CardSubtitle>
          <CardText>{this.props.items.map(itemType => `${itemType.quantity} ${itemType.item.name}`).join('\n')}</CardText>
          { this.progressMessage() }
        </Card>
      </div>
    )
  }
}

export default RestaurantPortal
