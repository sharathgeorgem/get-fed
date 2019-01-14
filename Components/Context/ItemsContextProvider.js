import React from 'react'
import fetch from 'isomorphic-unfetch'

const AppContext = React.createContext()

class ItemsContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      total: null,
      user: ''
    }
    this.domain = 'http://localhost:3000'
  }
  componentDidMount() {
    fetch(`${this.domain}/user/dummy`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          user: res.id
        })
      })
  }
  updateCart = cart => {
    this.setState({ items: cart.cart, total: cart.total })
  }
  render() {
    return (
      <AppContext.Provider
        value={{
          items: this.state.items,
          addItem: this.addItem,
          removeItem: this.removeItem,
          updateCart: this.updateCart,
          total: this.state.total,
          user: this.state.user,
          domain: this.domain
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

/* then make a consumer which will surface it as an HOC */
// This function takes a component...
export function withContext(Component) {
  // ...and returns another component...
  return function ContextComponent(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return (
      <AppContext.Consumer>
        {context => <Component {...props} context={context} />}
      </AppContext.Consumer>
    )
  }
}

export default ItemsContextProvider
