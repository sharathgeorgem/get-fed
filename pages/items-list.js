import React from 'react'
import fetch from 'isomorphic-unfetch'
import Layout from '../Components/Layout'

import {
  Button,
  Card,
  CardBody,
  CardColumns,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  Row
} from 'reactstrap'

class Items extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: ''
    }
  }

  render () {
    const items = this.props.items.menu
    console.log('Items in render are ', items)
    let display = []
    items.map((names) => {
      Object.entries(names).map(([key, res]) => {
        display.push(...res.map(dish => {
          return <Card
            style={{ width: '30%', margin: '10px 10px 10px 0' }}
            key={dish._id}
            className='h-100'
          >
            <CardImg
              top
              style={{ height: 250 }}
              src={dish.img}
            />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              <CardText>{dish.description}</CardText>
            </CardBody>
            <div className='card-footer'>
              <Button outline color='primary'>
                + Add To Cart
              </Button>
            </div>
          </Card>
        })
        )
      })
      console.log('The names after map are ', names)
    })
    console.log(items)
    if (items) {
      return (
        <React.Fragment>
          <Layout>
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
              </Row>
            </div>
          </Layout>
        </React.Fragment>)
    }
    return <h1>Loading</h1>
  }
}

Items.getInitialProps = async function () {
  const res = await fetch('http://localhost:3000/items')
  const data = await res.json()

  console.log(`The menu items fetched are : ${JSON.stringify(data, null, 4)}`)
  console.log(`The menu items fetched are : ${data.length}`)

  return {
    items: data
  }
}

export default Items
