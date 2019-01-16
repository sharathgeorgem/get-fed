import React from 'react'
import Link from 'next/link'
import { withUserContext } from '../Components/Context/UserContextProvider'
import { withRouter } from 'next/router'
import { compose } from 'recompose'

class Index extends React.Component {
  render () {
    return (
      <React.Fragment>
        <ul>
          <li><Link href='/restaurant-scaffold'><a>Customer</a></Link></li>
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
  withRouter
)(Index)
