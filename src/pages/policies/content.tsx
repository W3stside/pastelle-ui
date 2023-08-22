import { Column } from '@past3lle/components'
import { useIsSmallMediaWidth } from '@past3lle/hooks'
import { ArticleFadeInContainer } from 'components/Layout'
import SEO from 'components/SEO'
import { ProductBackendDescription } from 'pages/common/styleds'
import { useQueryPolicies } from 'shopify/graphql/hooks'
import { useThemeManager } from 'state/user/hooks'
import { BLACK_TRANSPARENT, ThemeModes } from 'theme'

const DEFAULT_HTML_PROPS = {
  accentColor: 'navajowhite',
  backgroundColor: 'transparent',
  color: 'ghostwhite',
}

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
  const isSmallScreen = useIsSmallMediaWidth()
  const { mode } = useThemeManager()

  if (queryResult?.error) throw new Error('Error loading policy, please try again later!')

  return (
    <>
      <SEO title={seo.title} name={seo.name} description={seo.description} />
      <ArticleFadeInContainer id={seo.title} style={{ overflowY: 'auto' }}>
        <Column
          padding="5%"
          backgroundColor={BLACK_TRANSPARENT}
          style={{ filter: mode === ThemeModes.DARK ? 'unset' : 'invert(1)' }}
        >
          <ProductBackendDescription
            {...DEFAULT_HTML_PROPS}
            color={DEFAULT_HTML_PROPS.accentColor}
            dangerouslySetInnerHTML={{ __html: queryResult.data?.shop?.[type]?.title as string }}
            fontSize="6rem"
          />
          <ProductBackendDescription
            {...DEFAULT_HTML_PROPS}
            dangerouslySetInnerHTML={{ __html: queryResult.data?.shop?.[type]?.body as string }}
            fontSize="2rem"
            fontStyle="normal"
            fontWeight={200}
            tableShadowColour={isSmallScreen ? '#c1c1c166' : undefined}
          />
        </Column>
      </ArticleFadeInContainer>
    </>
  )
}
