import React from 'react'
import fetch from 'isomorphic-unfetch'
import io from 'socket.io-client'
import keys from '../../keys'

const UserContext = React.createContext()

class UserContextProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: '',
      socket: null,
      userLocation: null,
      userAddress: ''
    }
    this.domain = 'http://localhost:3000'
  }

  componentDidMount () {
    let socket = io()
    socket.on('confirmConnection', () => this.setState({ socket: socket }))
    !this.state.userLocation
    ? (('geolocation' in navigator)
      ? (navigator.geolocation.getCurrentPosition(this.setPosition, console.log, {enableHighAccuracy: true})
      ) : console.log('Unavailable')
    ) : this.state.userLocation
    fetch(`${this.domain}/user/dummy`)
      .then(res => res.json())
      .then(res => this.setState({ userId: res.id }, () => socket.emit('identify', this.state.userId)))
  }

  setPosition = position => {
    console.log(position)
    console.log('The props are ', this.props)
    console.log('Key is ', keys.mapquest)
    this.setState(
      { userLocation : position },
      () => fetch(`http://www.mapquestapi.com/geocoding/v1/reverse?key=${keys.mapquest}&location=${this.state.userLocation.coords.latitude},${this.state.userLocation.coords.longitude}&includeRoadMetadata=true&includeNearestIntersection=true`)
        .then(res => res.json())
        .then(response => {
          console.log(response)
          const address = response.results[0].locations[0]
          console.log('The User address is ', address.street + ' ' + address.adminArea5 + ' ' + address.adminArea3)
          const userAddress = address.street + ' ' + address.adminArea5 + ' ' + address.adminArea3
          this.setState({userAddress: userAddress})
        })
    )
  }

  render () {
    return (
      <UserContext.Provider
        value={{
          userId: this.state.userId,
          socket: this.state.socket,
          userLocation: this.state.userLocation,
          userAddress: this.state.userAddress,
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
