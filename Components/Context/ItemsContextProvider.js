import React from 'react'
import http from '../../utilities/promisifiedHTTP'

const AppContext = React.createContext()


class ItemsContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      total: null,
      menu: {}
    }
  }
  componentDidMount() {
    // const cart = Cookies.getJSON("cart")
    // const cart = fetch('http://localhost:3000/user/dummy')
    // .then(res => res.json())
    // .then((response) => {
    //   console.log(response)
    //   return fetch('http://localhost:3000/user/cart/:' + response.id)
    // })
    
    // // if items in cart, set items and total from cookie
    // // console.log(cart)
    // let total
    // if (cart) {
    //   cart.map(item => {
    //     total = item.price * item.quantity;
    //     this.setState({ items: cart, total: total })
    //   })
    // }
  }

  addItem = item => {
    let { items } = this.state;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    const newItem = items.find(i => i._id === item._id);

    if (!newItem) {
      //set quantity property to 1
      item.quantity = 1;
      this.setState(
        {
          items: this.state.items.concat(item),
          total: this.state.total + item.price
        },
        // () => Cookies.set("cart", this.state.items)
        
      )
    } else {
      this.setState(
        {
          items: this.state.items.map(
            item =>
              item._id === newItem._id
                ? Object.assign({}, item, { quantity: item.quantity + 1 })
                : item
          ),
          total: this.state.total + item.price
        },
        // () => Cookies.set("cart", this.state.items)
      )
    }
  }
  removeItem = item => {
    let { items } = this.state;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    const newItem = items.find(i => i._id === item._id);
    if (newItem.quantity > 1) {
      this.setState(
        {
          items: this.state.items.map(
            item =>
              item._id === newItem._id
                ? Object.assign({}, item, { quantity: item.quantity - 1 })
                : item
          ),
          total: this.state.total - item.price
        },
        // () => Cookies.set("cart", this.state.items)
      )
    } else {
      const items = [...this.state.items];
      const index = items.findIndex(i => i._id === newItem._id);

      items.splice(index, 1);
      this.setState(
        { items: items, total: this.state.total - item.price },
        // () => Cookies.set("cart", this.state.items)
      )
    }
  }
  render() {
    return (
      <AppContext.Provider
        value={{
          items: this.state.items,
          addItem: this.addItem,
          removeItem: this.removeItem,
          total: this.state.total,
          menu: this.state.menu
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