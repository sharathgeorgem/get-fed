import React from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Router, { withRouter } from 'next/router'
import { compose } from 'recompose'

import { withUserContext } from '../Components/Context/UserContextProvider'
import AuthenticateForm from '../Components/AuthenticateForm'

function registerStatusMessage (code) {
  if (code === 3) {
    return 'Registration successful. A verification link has been sent to your email address.'
  } if (code === 14) {
    return 'This account is already registered but not verified. Please click the new link that has been sent to your email address.'
  } if (code === 15) {
    return 'An account is already registered with this email address. If it is yours, please log in.'
  } 
  return ''
}

function loginStatusMessage (code) {
  if (code === 3) {
    return 'Login successful'
  } if (code === 25) {
    return 'Incorrect password'
  } if (code === 13) {
    return 'There is no account registered for this email. Please sign up before logging in.'
  } if (code === 14) {
    return 'This account is not yet verified. Please click the new link that has been sent to your email address.'
  }
  return ''
}

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
    if (res.result) {
      console.log('Registration successful')
    } else console.log('Account already exists')
  }

  handleLogin = (res) => {
    if (res.ok) {
      console.log('Rerouting') // debug
      // this.props.userContext.setUser(user)
      Router.push('/restaurant-scaffold')  
    } else console.log('Invalid login')
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
          <AuthenticateForm route='register' handleSubmitResponse={this.handleRegister} statusMessage={registerStatusMessage}/>
        </TabPane>
        <TabPane tabId={2}>
          <AuthenticateForm route='login' handleSubmitResponse={this.handleLogin} statusMessage={loginStatusMessage} />
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
