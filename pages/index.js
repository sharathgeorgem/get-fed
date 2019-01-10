import { Button, Alert } from 'reactstrap'
import Layout from '../Components/Layout'

export default () => {
  return (
    <Layout>
      <div>
        <Alert color='primary'>
          Wanna get fed?
        </Alert>
        &nbsp; <Button color='primary'>Click Me</Button>
      </div>
    </Layout>
  )
}
