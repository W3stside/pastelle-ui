'use client'

import { Column } from '@past3lle/components'
import { useIsSmallMediaWidth } from '@past3lle/hooks'
import { ArticleFadeInContainer } from '@/components/Layout/Article'
import SEO from '@/components/SEO'
import { TRANSPARENT_HEX } from '@/constants/config'
import { ProductBackendDescription } from '@/components/pages-common/styleds'
import { useThemeManager } from '@/state/user/hooks'
import { BLACK_TRANSPARENT, ThemeModes } from '@/theme'
import { PoliciesQuery } from '@/shopify/graphql/types'

const DEFAULT_HTML_PROPS = {
  accentColor: 'navajowhite',
  backgroundColor: TRANSPARENT_HEX,
  color: 'ghostwhite',
}

type Props = {
  policy: Omit<PoliciesQuery['shop'], '__typename'>[keyof Omit<PoliciesQuery['shop'], '__typename'>]
}
export default function PolicyContent({ policy }: Props) {
  const isSmallScreen = useIsSmallMediaWidth()
  const { mode } = useThemeManager()

  if (!policy) return null

  return (
    <>
      <SEO title={policy.title} name={policy.title} description={policy.title} />
      <ArticleFadeInContainer id={policy.title} style={{ overflowY: 'auto' }}>
        <Column
          padding="5%"
          backgroundColor={BLACK_TRANSPARENT}
          style={{ filter: mode === ThemeModes.DARK ? 'unset' : 'invert(1)' }}
        >
          <ProductBackendDescription
            {...DEFAULT_HTML_PROPS}
            color={DEFAULT_HTML_PROPS.accentColor}
            dangerouslySetInnerHTML={{ __html: policy?.title as string }}
            fontSize="6rem"
          />
          <ProductBackendDescription
            {...DEFAULT_HTML_PROPS}
            dangerouslySetInnerHTML={{ __html: policy?.body as string }}
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
