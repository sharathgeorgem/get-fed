import React from 'react'
import fetch from 'isomorphic-unfetch'

const CartContext = React.createContext()

class CartContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      total: null,
      restaurantAddress: null
    }
    this.domain = 'http://localhost:3000'
  }

  updateCart = cart => {
    this.setState({ items: cart.cart, total: cart.total })
  }
  updateRestaurantAddress = address => {
    this.setState({ restaurantAddress: address})
  }
  render() {
    return (
      <CartContext.Provider
        value={{
          items: this.state.items,
          total: this.state.total,
          restaurantAddress: this.state.restaurantAddress,
          domain: this.domain,
          updateCart: this.updateCart,
          updateRestaurantAddress: this.updateRestaurantAddress
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
