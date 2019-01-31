import React from 'react'
import fetch from 'isomorphic-unfetch'
import {
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Row
} from 'reactstrap'

import Restaurants from '../Components/Restaurants'
import config from '../config'

class RestaurantScaffold extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }
  }
  onChange = (e) => {
    this.setState({ query: e.target.value.toLowerCase() })
  }
  render () {
    return (
      <div className='container-fluid'>
        <Row>
          <Col>
            <div className='search'>
              <InputGroup>
                <InputGroupAddon addonType='append'> Search </InputGroupAddon>
                <Input onChange={this.onChange} />
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
    )
  }
}

RestaurantScaffold.getInitialProps = async function (obj) {
<<<<<<< HEAD
  const res = await fetch(`${config.domain}/restaurant/12/76`)
=======
  const res = await fetch(`${config.domain}/restaurant/12/76`) // change to user location
>>>>>>> 94ed3a27eebb3abb4f382b01b2bad574336a5a48
  const data = await res.json()
  console.log('The user id defined is ', obj)
  console.log(`The data fetched : ${data.length}`)

  return {
    restaurants: data
  }
}

export default RestaurantScaffold
