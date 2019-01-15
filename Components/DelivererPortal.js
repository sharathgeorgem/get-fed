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
  render () {
    return (
      <div>
      <h2>Deliverer Portal</h2>
        {this.state.orders.map(order => {
          return <DelivererOrderCard
            restaurantName={order.restaurant.name}
            restaurantAddress={order.restaurant.address.value}
            items={order.items}
          />
        })}
      </div>
    )
  }
}

class DelivererOrderCard extends React.Component {
  render () {
    return (
      <div>
        <Card>
          <CardTitle>{this.props.restaurantName}</CardTitle>
          <CardSubtitle>{this.props.restaurantAddress}</CardSubtitle>
          <CardText>{this.props.items.map(itemType => `${itemType.quantity} ${itemType.item.name}`).join('\n')}</CardText>
          { order.status === 'new'
            ? <Button onClick={() => this.acceptDelivery(this.props.id)}>Deliver Order</Button>
            : <p>Delivering this order</p>
          }
        </Card>
      </div>
    )
  }
}

// socket.emit('arrivedAtRestaurant', order.id)
// socket.emit('pickedUp', order.id)
// socket.emit('delivered', order.id)

export default DelivererPortal
