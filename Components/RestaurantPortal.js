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
    this.socket.on('updateOrderStatus', order => this.setState({ orders: [order].concat(this.state.orders.filter(oldOrder => oldOrder.id !== order.id)) }))
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
            // restaurantName={order.restaurant.name}
            // restaurantAddress={order.restaurant.address.value}
            items={order.items}
            accepted={false}
          />
        })}
        <hr />
        {this.state.orders.filter(order => order.accepted).map(order => {
          return <RestaurantOrderCard
            timePlaced={order.timePlaced}
            customerAddress={order.address.value}
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
    console.log('The props for Restaurant are ', this.props)
    return (
      <div>
        <Card>
          <CardTitle>{this.props.timePlaced}</CardTitle>
          <CardSubtitle>{this.props.customerAddress}</CardSubtitle>
          <CardText>{this.props.items.map(itemType => `${itemType.quantity} ${itemType.item.name}`).join('\n')}</CardText>
          { this.props.accepted ? <p>Order Accepted</p> : <Button onClick={() => this.acceptOrder(this.props.id)}>Accept Order</Button> }
        </Card>
      </div>
    )
  }
}

export default RestaurantPortal
