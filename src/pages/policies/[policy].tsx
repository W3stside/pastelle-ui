/* eslint-disable react-refresh/only-export-components */
import PolicyContent from '../../components/PolicyContent'
import { queryPolicies } from '@/shopify/graphql/api/policies'
import { PoliciesQuery } from '@/shopify/graphql/types'

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const { shop: policies } = await queryPolicies()

  const paths = Object.keys(policies).reduce((acc, key) => {
    if (key !== '__typename') {
      acc?.push({ params: { policy: _shortenString(key, 'Policy', '') } })
    }
    return acc
  }, [] as { params: { policy: string } }[])

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { shop: policies } = await queryPolicies()

  if (!params?.policy) throw new Error('Missing policy param!')

  return { props: { policy: policies?.[_appendString(params.policy, 'Policy')] } }
}

interface Props {
  policy: Omit<PoliciesQuery['shop'], '__typename'>[keyof Omit<PoliciesQuery['shop'], '__typename'>]
}

export default function Policies({ policy }: Props) {
  return <PolicyContent policy={policy} />
}

function _shortenString(sbj: string, section: string, replaceWith: string) {
  return sbj.replace(section, replaceWith)
}

function _appendString(sbj: string, toAdd: string) {
  return sbj + toAdd
}