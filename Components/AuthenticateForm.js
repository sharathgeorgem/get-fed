// font Arial
import React from 'react'
import { Container, Col, Button, FormFeedback, FormGroup, Label, Input } from 'reactstrap'

const domain = 'http://localhost:3000'

class AuthenticateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      status: '',
      passwordStatus: false,
      emailStatus: false
    }
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
    if (event.target.name === 'password') {
      this.validatePassword(event.target.value)
    } else this.validateEmail(event.target.value)
  }
  validatePassword = (password) => {
    if (password.length >= 7) {
      this.setState({ passwordStatus: true })
    } else this.setState({ passwordStatus: false })
  }
  validateEmail = (email) => {
    this.setState({ emailStatus: /^(\S+)@(\S+).(\S+)$/.test(email) })
  }
  submit = async () => {
    let result = await fetch(`${domain}/auth/${this.props.route}/${this.state.email}/${this.state.password}`,
    {method: 'POST'})
    .then(res => res.json())
    .then(res => res.result)
    this.setState({ status: this.props.statusMessage(result)},() => Router.push('/'))
  }
  render () {
    return(
      <Container>
        <AuthenticationField id='email' label='Email' name='email' type='email' value={this.state.email} placeholder='Enter email address' valid={this.state.emailStatus} invalidMessage='This is not a valid email' handleChange={this.handleChange} />
        <AuthenticationField id='password' label='Password' name='password' type='password' value={this.state.password} placeholder='Enter password' valid={this.state.passwordStatus} invalidMessage='Password must be at least seven characters' handleChange={this.handleChange} />
        <Button onClick={this.submit} disabled={!(this.state.passwordStatus && this.state.emailStatus)}>Continue</Button>
        <p>{this.state.status}</p>
      </Container>
    )
  }
}

function AuthenticationField (props) {
    return <FormGroup row>
        <Label for={props.name} sm={2}>{props.label}</Label>
        <Col sm={10}>
          <Input
            bsSize='lg'
            type={props.type}
            name={props.name}
            id={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.handleChange}
            valid={props.valid}
            invalid={!props.valid}
          />
          <FormFeedback valid>Nice</FormFeedback>
          <FormFeedback>{props.invalidMessage}</FormFeedback>
        </Col>
      </FormGroup>
}

export default AuthenticateForm
