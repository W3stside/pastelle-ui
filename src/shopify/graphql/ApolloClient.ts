import { ApolloClient, createHttpLink } from '@apollo/client'
import { InMemoryCache } from '@apollo/client/cache'

if (!import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN) {
  throw new Error('[Pastelle Shop UI] Missing process env VITE_SHOPIFY_STOREFRONT_TOKEN! Check env.')
}

export const link = createHttpLink({
  uri: `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/${import.meta.env.VITE_SHOPIFY_API_VERSION}/graphql.json`,
  headers: {
    'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
    Accept: 'application/graphql',
  },
  fetch,
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})
