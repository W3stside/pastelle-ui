import { ApolloClient, createHttpLink } from '@apollo/client'
import { InMemoryCache } from '@apollo/client/cache'

if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN) {
  throw new Error('[Pastelle Shop UI] Missing process env NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN! Check env.')
}

export const link = createHttpLink({
  uri: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`,
  headers: {
    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
    Accept: 'application/graphql',
  },
  fetch,
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})
