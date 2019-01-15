import React from 'react'
import fetch from 'isomorphic-unfetch'

const CartContext = React.createContext()

class CartContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      total: null,
    }
    this.domain = 'http://localhost:3000'
  }

  updateCart = cart => {
    this.setState({ items: cart.cart, total: cart.total })
  }
  render() {
    return (
      <CartContext.Provider
        value={{
          items: this.state.items,
          total: this.state.total,
          domain: this.domain,
          updateCart: this.updateCart
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    )
  }
}

/* then make a consumer which will surface it as an HOC */
// This function takes a component...
export function withCartContext(Component) {
  // ...and returns another component...
  return function CartContextComponent(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return (
      <CartContext.Consumer>
        {context => <Component {...props} cartContext={context} />}
      </CartContext.Consumer>
    )
  }
}

export default CartContextProvider
