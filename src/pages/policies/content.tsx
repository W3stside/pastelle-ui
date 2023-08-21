import { Column } from '@past3lle/components'
import { ArticleFadeInContainer } from 'components/Layout'
import SEO from 'components/SEO'
import { ProductBackendDescription } from 'pages/common/styleds'
import { useQueryPolicies } from 'shopify/graphql/hooks'

type Props = {
  type: 'shippingPolicy' | 'privacyPolicy' | 'refundPolicy'
  queryResult: Omit<ReturnType<typeof useQueryPolicies>, 'loading'>
  seo: {
    title: string
    name: string
    description: string
  }
}
export default function PolicyContent({ type, queryResult, seo }: Props) {
  if (queryResult?.error) throw new Error('Error loading policy, please try again later!')
  return (
    <>
      <SEO title={seo.title} name={seo.name} description={seo.description} />
      <ArticleFadeInContainer id={seo.title} style={{ overflowY: 'auto' }}>
        <Column padding="5%" backgroundColor={'rgba(255,255,255,0.92)'}>
          <ProductBackendDescription
            backgroundColor={'transparent'}
            dangerouslySetInnerHTML={{ __html: queryResult.data?.shop?.[type]?.title as string }}
            accentColor="lavender"
            fontSize="6rem"
            color={'black'}
          />
          <ProductBackendDescription
            backgroundColor={'transparent'}
            dangerouslySetInnerHTML={{ __html: queryResult.data?.shop?.[type]?.body as string }}
            fontSize="2rem"
            fontStyle="normal"
            fontWeight={200}
            accentColor="lavender"
            color={'black'}
          />
        </Column>
      </ArticleFadeInContainer>
    </>
  )
}
