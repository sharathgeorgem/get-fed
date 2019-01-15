import React from 'react'
import { withCartContext } from './Context/CartContextProvider'
import { withUserContext } from './Context/UserContextProvider'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { compose } from 'recompose'

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Badge
} from 'reactstrap'

class Cart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cartItems: ''
    }
  }

  addItem = itemType => {
    console.log('added item is', itemType.item.id)
    fetch(`${this.props.cartContext.domain}/user/cart/${this.props.userContext.userId}/${itemType.item.id}`, {
      method: 'PUT'
    })
    .then(res => res.json())
    .then(this.props.cartContext.updateCart)
  }

  removeItem = itemType => {
    console.log('removed item is', itemType.item.id)
    fetch(`${this.props.cartContext.domain}/user/cart/${this.props.userContext.userId}/${itemType.item.id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(this.props.cartContext.updateCart)
  }

  render () {
    const { items } = this.props.cartContext
    console.log('The props are ', this.props)
    console.log('The items here are ', items)
    return (
      <div>
        <Card style={{ padding: '10px 5px' }} className='cart'>
          <CardTitle style={{ margin: 10 }}>Your Order:</CardTitle>
          <hr />
          <CardBody style={{ padding: 10 }}>
            <div style={{ marginBottom: 6 }}>
              <small>Items:</small>
            </div>
            <div>
              {items
                ? items.map(itemType => {
                  if (itemType.quantity > 0) {
                    return (
                      <div
                        className='items-one'
                        style={{ marginBottom: 15 }}
                        key={itemType.item._id}
                      >
                        <div>
                          <span id='item-price'>&nbsp; ₹{itemType.item.price}</span>
                          <span id='item-name'>&nbsp; {itemType.item.name}</span>
                        </div>
                        <div>
                          <Button
                            style={{
                              height: 25,
                              padding: 0,
                              width: 15,
                              marginRight: 5,
                              marginLeft: 10
                            }}
                            onClick={this.addItem.bind(this, itemType)}
                            color='link'
                          >
                              +
                          </Button>
                          <Button
                            style={{
                              height: 25,
                              padding: 0,
                              width: 15,
                              marginRight: 10
                            }}
                            onClick={this.removeItem.bind(this, itemType)}
                            color='link'
                          >
                              -
                          </Button>
                          <span style={{ marginLeft: 5 }} id='item-quantity'>
                            {itemType.quantity}
                          </span>
                        </div>
                      </div>
                    )
                  }
                })
                : null}
              {items.length > 0 ? (
                <div>
                  <Badge style={{ width: 200, padding: 10 }} color='light'>
                    <h5 style={{ fontWeight: 100, color: 'gray' }}>Total:</h5>
                    <h3>₹{this.props.cartContext.total}</h3>
                  </Badge>
                  {this.props.router.pathname !== '/checkout' ? (
                    <div
                      style={{
                        marginTop: 10,
                        marginRight: 10
                      }}
                    >
                      <Link href='/checkout'>
                        <Button style={{ width: '100%' }} color='primary'>
                          <a>Order</a>
                        </Button>
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </CardBody>
        </Card>
        <style jsx>{`
          #item-price {
            font-size: 1.3em;
            color: rgba(97, 97, 97, 1);
          }
          #item-quantity {
            font-size: 0.95em;
            padding-bottom: 4px;
            color: rgba(158, 158, 158, 1);
          }
          #item-name {
            font-size: 1.3em;
            color: rgba(97, 97, 97, 1);
          }
        `}</style>
      </div>
    )
  }
}

export default compose(
  withCartContext,
  withUserContext,
  withRouter
)(Cart)
