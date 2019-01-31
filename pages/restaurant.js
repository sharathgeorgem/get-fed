import React from 'react'
import fetch from 'isomorphic-unfetch'
// import Layout from '../Components/Layout'
import { withCartContext } from '../Components/Context/CartContextProvider'
import { withUserContext } from '../Components/Context/UserContextProvider'
import { withRouter } from 'next/router'
import { compose } from 'recompose'
import Cart from '../Components/Cart'

import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardImgOverlay,
  CardText,
  CardTitle,
  Col,
  Container,
  Row
} from 'reactstrap'

class Restaurant extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      categories: []
    }
  }

  componentDidMount () {
    console.log('Component mounting')
    fetch(`${this.props.userContext.domain}/menu/${this.props.router.query.id}`)
      .then(res => res.json())
      .then(res => {
        console.log('Props available can be', this.props)
        this.setState({
          categories: res.menu
        })
        console.log('The response restaurant address ', res.address)
        this.props.cartContext.updateRestaurantAddress(res.address)
      })
  }

  addItem = item => {
    if (this.props.cartContext.restaurantId && this.props.cartContext.restaurantId !== item.restaurant) {
      alert('Please empty your cart before adding items from a different restaurant')
    } else fetch(`${this.props.userContext.domain}/user/cart/${this.props.userContext.userId}/${item.id}`, {
      method: 'PUT'
    })
    .then(res => res.json())
    .then(this.props.cartContext.updateCart)
  }

  render () {
    console.log('Categories in render are ', this.state.categories)
    console.log('The props are all ', this.props)
    let display = this.state.categories.map(category => {
      return <CategorySection
        key={category._id}
        name={category.category}
        items={category.items}
        addItem={this.addItem}
      />
    })
    if (this.state.categories) {
      return (
        <React.Fragment>
          <div className='container-fluid'>
            <Row>
              <Col xs='9' style={{ padding: 0 }}>
                <div className='h-100'>
                  <Container fluid>
                    {display}
                  </Container>
                  <style jsx global>
                    {`
                    a {
                      color: white;
                    }
                    a:link {
                      text-decoration: none;
                      color: white;
                    }
                    .container-fluid {
                      margin-bottom: 30px;
                    }
                    .btn-outline-primary {
                      color: #007bff !important;
                    }
                    a:hover {
                      color: white !important;
                    }
                    .card-columns {
                      column-count: 3;
                    }
                    .card {
                      display: inline-block !important;
                    }
                  `}
                  </style>
                </div>
              </Col>
              <Col xs='3' style={{ padding: 0 }}>
                <div>
                  <h1>Cart</h1>
                  <Cart />
                </div>
              </Col>
            </Row>
          </div>
        </React.Fragment>)
    }
    return <h1>Loading</h1>
  }
}

class CategorySection extends React.Component {
  render () {
    return (
      <div>
        <h2>{this.props.name}</h2>
        {this.props.items.map(dish => {
          return <ItemCard 
            key={dish._id}
            dish={dish}
            addItem={this.props.addItem}
          />
        })}
      </div>
    )
  }
}

class ItemCard extends React.Component {
  render () {
    return (
      <Card
        style={{ width: '30%', margin: '10px 10px 10px 0' }}
        className='h-100'
      >
        <CardImg
          top
          style={{ height: 250 }}
          src={this.props.dish.img}
        />
        {/* <CardImgOverlay>
          <CardText style={{ background: 'black', color: '#fff' }}>
            {this.props.dish.description}
          </CardText>
        </CardImgOverlay> */}
        <CardBody>
          <CardTitle>{this.props.dish.name}</CardTitle>
        </CardBody>
        <div className='card-footer'>
          { this.props.dish.available ?
            <Button
              outline color='primary'
              onClick={this.props.addItem.bind(this, this.props.dish)}
              style={{ zIndex: 10000 }}
            >
            + Add To Cart
            </Button>
            : <CardText>Sold Out</CardText>
          }
        </div>
      </Card>
    )
  }
}

export default compose(
  withRouter,
  withUserContext,
  withCartContext
)(Restaurant)
