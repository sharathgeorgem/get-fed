import React from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Router, { withRouter } from 'next/router'
import { compose } from 'recompose'

import { withUserContext } from '../Components/Context/UserContextProvider'
import AuthenticateForm from '../Components/AuthenticateForm'

class Authenticate extends React.Component {
  constructor (props) {
    super(props)
    this.state = { activeTab: 1 }
  }

  switchTab = tab => {
    this.setState({ activeTab: tab })
  }

  handleRegister = async (res) => {
    res = await res.json()
    if (res.result) return 'Registration successful'
    return 'Account already exists'
  }

  handleLogin = async (res) => {
    if (res.ok) {
      console.log('Rerouting') // debug
      // this.props.userContext.setUser(user)
      Router.push('/restaurant-scaffold')
      return 'Login successful'
    } return 'Invalid username or password'
  }

  render () {
    return(
      <div>
      <Nav tabs style={{ marginTop: 20 + 'px' }}>
        <NavItem>
          <NavLink
            className={this.state.activeTab===1 ? 'active' : 'not'}
            onClick={() => { this.switchTab(1) }}
          >
            <span style={{ color: '#000' }}>Sign Up</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={this.state.activeTab===2 ? 'active' : 'not'}
            onClick={() => { this.switchTab(2) }}
          >
          <span style={{ color: '#000' }}>Login</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={this.state.activeTab} style={{ marginTop: 20 + 'px' }}>
        <TabPane tabId={1}>
          <AuthenticateForm route='register' handleSubmitResponse={this.handleRegister} />
        </TabPane>
        <TabPane tabId={2}>
          <AuthenticateForm route='login' handleSubmitResponse={this.handleLogin} />
        </TabPane>
      </TabContent>
      </div>
    )
  }
}

export default compose(
  withRouter,
  withUserContext
)(Authenticate)
