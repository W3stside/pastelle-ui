import { ApolloClient, ApolloProvider as ApolloProviderBase, InMemoryCache, createHttpLink } from '@apollo/client'
import React from 'react'

const link = createHttpLink({
  uri: `https://${process.env.REACT_APP_SHOPIFY_STORE_DOMAIN}/api/${process.env.REACT_APP_SHOPIFY_API_VERSION}/graphql.json`,
  headers: {
    'X-Shopify-Storefront-Access-Token': process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN,
    Accept: 'application/graphql'
  },
  fetch
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link
})

const ApolloProvider: React.FCC = ({ children }) => (
  <ApolloProviderBase client={apolloClient}>{children}</ApolloProviderBase>
)

export default ApolloProvider
