import { Button, Alert } from 'reactstrap'
import Layout from '../Components/Layout'
import fetch from 'isomorphic-unfetch'

const Index = (props) => (
  <Layout>
    <div>
      <Alert color='primary'>
        Wanna get fed?
      </Alert>
      &nbsp; <Button color='primary'>Click Me</Button>
    </div>
  </Layout>
)

Index.getInitialProps = async function () {
  const res = await fetch('http://localhost:3000/restaurant')
  const data = await res.json()

  console.log(`The data fetched is : ${JSON.stringify(data)}`)
  console.log(`The data fetched : ${data.length}`)

  return {
    restaurants: data
  }
}

export default Index
