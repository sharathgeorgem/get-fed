import React from 'react'
import fetch from 'isomorphic-unfetch'
import io from 'socket.io-client'

const UserContext = React.createContext()

class UserContextProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: '',
      userName: '',
      socket: null,
      userLocation: false,
      userAddress: ''
    }
  }

  componentDidMount () {
    if(!this.state.userId) {
      let socket = io()
      socket.on('confirmConnection', () => this.setState({ socket: socket }))
    }
    !this.state.userLocation
    ? (('geolocation' in navigator)
      ? (navigator.geolocation.getCurrentPosition(this.setPosition, console.log, {enableHighAccuracy: true})
      ) : console.log('Unavailable')
    ) : this.state.userLocation
  }

  setUser = (user, name) => {
    console.log('Will this fire?')
    this.setState({ userId: user, userName: name }, () => {
    console.log('I guess it just did')
    this.state.socket.emit('identify', this.state.userId)
  })}

  setPosition = position => {
    console.log(position)
    console.log('The props are ', this.props)
    this.setState(
      { userLocation : position },
      () => fetch(`https://www.mapquestapi.com/geocoding/v1/reverse?key=${process.env.MAPQUEST_API_KEY}&location=${this.state.userLocation.coords.latitude},${this.state.userLocation.coords.longitude}&includeRoadMetadata=true&includeNearestIntersection=true`)
        .then(res => res.json())
        .then(response => {
          console.log(response)
          const address = response.results[0].locations[0]
          const userAddress = [address.street, address.adminArea6, address.adminArea5, address.adminArea4, address.adminArea3, address.adminArea2, address.adminArea1].join(' ')
          console.log('The User address is ', userAddress)
          this.setState({userAddress: userAddress})
        })
    )
  }

  render () {
    return (
      <UserContext.Provider
        value={{
          userId: this.state.userId,
          userName: this.state.userName,
          socket: this.state.socket,
          userLocation: this.state.userLocation,
          userAddress: this.state.userAddress,
          setUser: this.setUser
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export function withUserContext (Component) {
  return function UserContextComponent (props) {
    return (
      <UserContext.Consumer>
        {context => <Component {...props} userContext={context} />}
      </UserContext.Consumer>
    )
  }
}

export default UserContextProvider
