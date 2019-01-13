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
  initializeConnection = async () => {
    this.socket = io.connect(domain)
    this.socket.emit('identify', this.props.id)
    this.socket.on('newOrder', order => this.setState({ orders: [Object.assign(order, { status: 'new' })].concat(this.state.orders) }))
    this.socket.on('acceptOrderConfirmed', order => this.setState({ orders: [order].concat(this.state.orders.filter(oldOrder => oldOrder.id !== order.id)) }))
    this.socket.on('delivererArrivedRestaurant', (orderId, delivererId) => null)
    this.socket.on('orderPickedUp', )
  }
  acceptOrder = (orderId) => {
    this.socket.emit('acceptOrder', orderId)
  }
  render () {
    return (
      <div>
        {this.state.orders.filter(order => !order.accepted).map(order => {
          return <RestaurantOrderCard
            restaurantName={order.restaurant.name}
            restaurantAddress={order.restaurant.address.value}
            items={order.items}
            accepted={false}
          />
        })}
        <p>-----</p>
        {this.state.orders.filter(order => order.accepted).map(order => {
          return <RestaurantOrderCard
            restaurantName={order.restaurant.name}
            restaurantAddress={order.restaurant.address.value}
            items={order.items}
            accepted={true}
          />
        })}
      </div>
    )
  }
}

class RestaurantOrderCard extends React.Component {
  render () {
    return (
      <div>
        <Card>
          <CardTitle>{this.props.restaurantName}</CardTitle>
          <CardSubtitle>{this.props.restaurantAddress}</CardSubtitle>
          <CardText>{this.props.items.map(itemType => `${itemType.quantity} ${itemType.item.name}`).join('\n')}</CardText>
          { this.props.accepted ? <p>Order Accepted</p> : <Button>Accept Order</Button> }
        </Card>
      </div>
    )
  }
}


export default RestaurantPortal
