import Layout from '../Components/Layout'
import fetch from 'isomorphic-unfetch'
import Restaurants from '../Components/Restaurants'
import React from 'react'

import {
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Row
} from 'reactstrap'

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }
  }
  onChange (e) {
    this.setState({ query: e.target.value.toLowerCase() })
  }
  render () {
    return (
      <Layout>
        <div className='container-fluid'>
          <Row>
            <Col>
              <div className='search'>
                <InputGroup>
                  <InputGroupAddon addonType='append'> Search </InputGroupAddon>
                  <Input onChange={this.onChange.bind(this)} />
                </InputGroup>
              </div>
              <Restaurants restaurants={this.props.restaurants} />
            </Col>
          </Row>
          <style jsx>
            {`
              .search {
                margin: 20px;
                width: 500px;
              }
            `}
          </style>
        </div>
      </Layout>
    )
  }
}

Index.getInitialProps = async function () {
  const res = await fetch('http://localhost:3000/restaurant')
  const data = await res.json()

  console.log(`The data fetched is : ${JSON.stringify(data, null, 4)}`)
  console.log(`The data fetched : ${data.length}`)

  return {
    restaurants: data
  }
}

export default Index
