import React from 'react'

import config from '../../config'

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
  }
  updateCart = cart => {
    this.setState({ items: cart.cart, total: cart.total, restaurantId: cart.cart.length > 0 ? cart.cart[0].item.restaurant : '' })
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
          domain: config.domain,
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
