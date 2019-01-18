import React from 'react'
import fetch from 'isomorphic-unfetch'

const CartContext = React.createContext()

class CartContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      total: null,
      restaurantId: '',
      restaurantAddress: null,
      orderId: ''
    }
    this.domain = 'http://localhost:3000'
  }

  updateCart = cart => {
    this.setState({ items: cart.cart, total: cart.total, restaurantId: cart.cart[0].restaurant })
  }
  updateRestaurantAddress = address => {
    this.setState({ restaurantAddress: address})
  }
  updateOrderId = id => {
    this.setState({ orderId: id })
  }
  render() {
    return (
      <CartContext.Provider
        value={{
          items: this.state.items,
          total: this.state.total,
          restaurantId: this.state.restaurantId,
          restaurantAddress: this.state.restaurantAddress,
          orderId: this.state.orderId,
          domain: this.domain,
          updateCart: this.updateCart,
          updateRestaurantAddress: this.updateRestaurantAddress,
          updateOrderId: this.updateOrderId
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    )
  }
}

export function withCartContext(Component) {
  return function CartContextComponent(props) {
    return (
      <CartContext.Consumer>
        {context => <Component {...props} cartContext={context} />}
      </CartContext.Consumer>
    )
  }
}

export default CartContextProvider
