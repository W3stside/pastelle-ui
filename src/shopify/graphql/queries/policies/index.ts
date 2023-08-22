import { gql } from '@apollo/client'

export const QUERY_POLICIES = gql`
  query Policies {
    shop {
      shippingPolicy {
        title
        body
      }
      privacyPolicy {
        title
        body
      }
      refundPolicy {
        title
        body
      }
    }
  }
`
