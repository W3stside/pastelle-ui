import { devDebug } from '@past3lle/utils'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryPolicies } from 'shopify/graphql/hooks'

import PolicyContent from './content'

export default function Policies() {
  const { policy } = useParams()
  const navigate = useNavigate()

  let props
  switch (policy) {
    case 'shipping':
      props = {
        type: 'shippingPolicy',
        seo: { title: 'SHIPPING POLICY', name: 'SHIPPING POLICY', description: 'PASTELLE shipping policy' },
      } as const
      break
    case 'privacy':
      props = {
        type: 'privacyPolicy',
        seo: { title: 'PRIVACY POLICY', name: 'PRIVACY POLICY', description: 'PASTELLE privacy policy' },
      } as const
      break
    case 'refunds':
      props = {
        type: 'refundPolicy',
        seo: { title: 'REFUND POLICY', name: 'REFUND POLICY', description: 'PASTELLE refund policy' },
      } as const
      break
    default:
      props = null
      break
  }

  const queryResult = useQueryPolicies()

  if (!props) {
    devDebug('No policy, redirecting')
    navigate('/404')
    return null
  }

  return <PolicyContent type={props.type} queryResult={queryResult} seo={props.seo} />
}
