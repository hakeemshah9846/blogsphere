// frontend/pages/_app.js
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apollo-client'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp