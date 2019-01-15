import React, { Component } from 'react'
import Cart from '../Components/Cart'
import CheckoutForm from '../Components/CheckoutForm'

import { Row, Col } from 'reactstrap'
import { withUserContext } from '../Components/Context/UserContextProvider'
import { withCartContext } from '../Components/Context/CartContextProvider'
import { compose } from 'recompose'
import Router from 'next/router'

class Checkout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: {}
    }
  }
  componentDidMount () {
    const { cartContext } = this.props
    if (cartContext.items.length === 0) {
      Router.push('/')
    }
  }

  render () {
    console.log('checkout.js props are ', this.props)
    const { cartContext } = this.props
    if (cartContext.items.length === 0) {
      return <h1>Cart Empty</h1>
    } else {
      return (
        <Row>
          <Col
            style={{ paddingRight: 0 }}
            sm={{ size: 3, order: 1, offset: 2 }}
          >
            <h1 style={{ margin: 20 }}>Checkout</h1>
            <Cart />
          </Col>
          <Col style={{ paddingLeft: 5 }} sm={{ size: 6, order: 2 }}>
            <CheckoutForm context={this.props.cartContext} />
          </Col>
        </Row>
      )
    }
  }
}

export default compose(
  withUserContext,
  withCartContext
)(Checkout)
