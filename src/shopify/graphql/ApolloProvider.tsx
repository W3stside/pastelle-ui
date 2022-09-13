import React from 'react'
import { ApolloClient, ApolloProvider as ApolloProviderBase, createHttpLink, InMemoryCache } from '@apollo/client'

const link = createHttpLink({
  uri: `https://${process.env.REACT_APP_SHOPIFY_STORE_DOMAIN}/api/${process.env.REACT_APP_SHOPIFY_API_VERSION}/graphql.json`,
  headers: {
    'X-Shopify-Storefront-Access-Token': process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN,
    Accept: 'application/graphql'
  },
  fetch
})

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link
})

const ApolloProvider: React.FCC = ({ children }) => (
  <ApolloProviderBase client={apolloClient}>{children}</ApolloProviderBase>
)

export default ApolloProvider
