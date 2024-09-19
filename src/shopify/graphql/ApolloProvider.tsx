import { ApolloProvider as ApolloProviderBase } from '@apollo/client'
import React from 'react'
import { apolloClient } from './ApolloClient'

const ApolloProvider: React.FCC = ({ children }) => (
  <ApolloProviderBase client={apolloClient}>{children}</ApolloProviderBase>
)

export default ApolloProvider
