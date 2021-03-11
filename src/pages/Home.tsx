import { RouteComponentProps } from 'react-router'
import { Layout } from './Layout'


interface HomeProps extends RouteComponentProps {

}


const Home = (props: HomeProps) => {

  return <Layout title="Welcome" {...props} />

}

export default Home
