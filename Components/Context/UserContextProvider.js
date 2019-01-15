import React from 'react'
import fetch from 'isomorphic-unfetch'
import io from 'socket.io-client'

const UserContext = React.createContext()

class UserContextProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: '',
      socket: null
    }
    this.domain = 'http://localhost:3000'
  }
  componentDidMount () {
    let socket = io()
    socket.on('confirmConnection', () => this.setState({ socket: socket }))

    fetch(`${this.domain}/user/dummy`)
      .then(res => res.json())
      .then(res => this.setState({ userId: res.id }, () => socket.emit('identify', this.state.userId)))
  }
  render () {
    return (
      <UserContext.Provider
        value={{
          userId: this.state.userId,
          socket: this.state.socket,
          domain: this.domain
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

/* then make a consumer which will surface it as an HOC */
// This function takes a component...
export function withUserContext (Component) {
  // ...and returns another component...
  return function UserContextComponent (props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return (
      <UserContext.Consumer>
        {context => <Component {...props} userContext={context} />}
      </UserContext.Consumer>
    )
  }
}

export default UserContextProvider
