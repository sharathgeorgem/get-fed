import React from 'react'
import Link from 'next/link'
import { withUserContext } from '../Components/Context/UserContextProvider'
import { withRouter } from 'next/router'
import { compose } from 'recompose'
import { 
  Button,
  Row,
  Col,
  Input 
} from 'reactstrap'

class Index extends React.Component {
  // componentDidMount () {
  //   let e = ['🏻', '🏼', '🏽', '🏾', '🏿']
  //   function loop () {
  //     let s = ''
  //     let i, m
  //     for (i = 0; i < 10; i++) {
  //       m = Math.floor(e.length * ((Math.sin((Date.now() / 100) + i) + 1) / 2))
  //       s += '👶' + e[m]
  //     }
  //     window.location.hash = s
  //     setTimeout(loop, 50)
  //   }
  //   loop()
  // }

  render () {
    return (
      <React.Fragment>
        <Row>
          <Col
            style={{ paddingRight: 0 }}
            sm={{ size: 3, order: 1, offset: 2 }}
          >
            <h1 style={{ margin: 20 }}>LOGIN</h1>
          </Col>
          <Col style={{ paddingLeft: 5 }} sm={{ size: 6, order: 2 }}>
            <img src='https://source.unsplash.com/900x450/?restaurant' alt='Restaurant image' />  
          </Col>
        </Row>
        <ul>
          <li><Link href='/auth/index'><a>Customer</a></Link></li>
          <li><Link href='/deliverer-portal'><a>Deliverer</a></Link></li>
          <li><Link href='/restaurant-portal'><a>Restaurant</a></Link></li>
        </ul>
        <style jsx global>
          {`
            li {
              color: white;
            }

            body {
              background-color: gray;
            }
          `}
        </style>
      </React.Fragment>
    )
  }
}

export default compose(
  withRouter,
  withUserContext
)(Index)
