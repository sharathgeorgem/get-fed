import React from 'react'
import Link from 'next/link'
import { withUserContext } from '../Components/Context/UserContextProvider'
import { withRouter } from 'next/router'
import { compose } from 'recompose'

class Index extends React.Component {
  componentDidMount () {
    let e = ['🏻', '🏼', '🏽', '🏾', '🏿'];

    function loop () {
      let s = ''
      let i, m

      for (i = 0; i < 10; i++) {
        m = Math.floor(e.length * ((Math.sin((Date.now() / 100) + i) + 1) / 2))
        s += '👶' + e[m]
      }

      window.location.hash = s

      setTimeout(loop, 50)
    }

    loop()
  }
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
