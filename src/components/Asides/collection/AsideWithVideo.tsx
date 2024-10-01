'use client'
import { Row } from '@past3lle/components'
import { ProductAsidePanel, /* ProductContainer, */ ScrollingProductLabel } from '@/components/PagesComponents/styleds'
import { CollectionPageProps } from '@/components/PagesComponents/types'
import { useCurrentCollection, useUpdateCurrentlyViewingProduct } from '@/state/collection/hooks'
import { defaultThemeColours } from '@/theme'

import { BLACK } from '@past3lle/theme'
import dynamic from 'next/dynamic'
import { useIsClientReady } from '@/hooks/useIsClientReady'
import Loader from '@/components/Loader'

const ProductContainer = dynamic(
  import(
    /* webpackPrefetch: true,  webpackChunkName: "PRODUCT_CONTAINER" */ '@/components/PagesComponents/styleds'
  ).then((module) => module.ProductContainer),
  { ssr: false, loading: () => <Loader /> },
)

const DynamicCollectionCarouseScreen = dynamic(
  import(
    /* webpackPrefetch: true,  webpackChunkName: "COLLECTIONSCREENWITHCAROUSEL" */ './CollectionScreenWithCarousel'
  ),
  { ssr: false },
)

export default function CollectionProductPage(props: CollectionPageProps) {
  const {
    id,
    logo,
    title,
    color = '#000',
    handle,
    lockedImages = [],
    bgColor,
    navLogo,
    isActive,
    itemIndex,
    headerLogo,
    shortDescription,
  } = props
  // UPDATE VIEWING WITH WHATEVER ITEM IS CURRENT ON SCREEN
  useUpdateCurrentlyViewingProduct(isActive, { handle, id })

  // COLLECTION SIZE (for scrolling product label)
  const { collection } = useCurrentCollection()
  const collectionSize = collection ? Object.keys(collection.products).length : 0

  const clientReady = useIsClientReady()

  return (
    <>
      <ScrollingProductLabel logo={headerLogo} labelColor={bgColor || BLACK} flexWrap="wrap">
        <Row justifyContent="space-between" alignItems={'center'} width="100%">
          <strong>
            {title}
            {lockedImages?.[0]?.url && (
              <span id="locked-skill-label" style={{ color: defaultThemeColours.red1, marginLeft: '1rem' }}>
                [SKILL LOCKED]
              </span>
            )}
          </strong>
          <strong>
            VIEWING {itemIndex + 1}/{collectionSize}
          </strong>
        </Row>
        <Row>
          <span style={{ fontSize: 'smaller' }}>{shortDescription}</span>
        </Row>
      </ScrollingProductLabel>
      {clientReady ? (
        <ProductContainer id="#item-container" bgColor={color || BLACK} navLogo={navLogo} logo={logo}>
          <ProductAsidePanel id="#item-aside-panel">
            <DynamicCollectionCarouseScreen {...props} />
          </ProductAsidePanel>
        </ProductContainer>
      ) : (
        <Loader />
      )}
    </>
  )
}
