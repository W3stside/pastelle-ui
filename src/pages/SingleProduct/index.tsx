import { useDeriveSkillState } from '@past3lle/forge-web3'
import { useIsMobile } from '@past3lle/hooks'
import { devDebug } from '@past3lle/utils'
import SEO from 'components/SEO'
import ShowcaseVideos from 'components/Showcase/Videos'
import { SHOWCASE_ENABLED, Z_INDEXES } from 'constants/config'
import { SinglePageSmartWrapper } from 'pages/common'
import { DEFAULT_MEDIA_START_INDEX } from 'pages/common/constants'
import { useProductWebCarouselActions } from 'pages/common/hooks/useProductCarouselActions'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetProductFromHandle, useUpdateCurrentlyViewingProduct } from 'state/collection/hooks'

import AsideWithVideo from './AsideWithVideo'
import { LargeProductAndSizeChartImagesCarousel } from './LargeProductAndSizeChartCarousels'
import { SingleProductAsidePanel, SingleProductContainer, SingleProductScreensContainer } from './styled'

export default function SingleProductPage() {
  // Internal referrer = shopify handle
  // External referrer = shopfiy ID
  const { handle } = useParams()
  const product = useGetProductFromHandle(handle)

  // update state store with current browsing SINGLE product
  useUpdateCurrentlyViewingProduct(true, product)

  // MOBILE/WEB CAROUSEL
  const { currentIndex: currentCarouselIndex, onChange: onCarouselChange } = useProductWebCarouselActions({
    startIndex: DEFAULT_MEDIA_START_INDEX,
  })

  const isMobile = useIsMobile()
  const lockStatus = useDeriveSkillState(product?.skillMetadata)

  const navigate = useNavigate()
  useEffect(() => {
    // redirect if no product
    if (!product) {
      devDebug('No product, redirecting')
      navigate('/404')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  if (!product) return null

  return (
    <>
      <SEO
        title={product.handle.toUpperCase()}
        name={product.handle.toUpperCase()}
        description={`${product.handle.toUpperCase()}: ${product.shortDescription || 'STREET.APPAREL'}`}
      />
      <SinglePageSmartWrapper>
        {(smartWrapperProps) => (
          <>
            <LargeProductAndSizeChartImagesCarousel
              color={product.color}
              images={product.images}
              lockedImages={product.lockedImages}
              sizeChart={product.sizeChart}
              currentIndex={currentCarouselIndex}
              isMobile={isMobile}
              skillState={lockStatus}
            />
            <SingleProductContainer id="#item-container" parentAspectRatio={smartWrapperProps.parentAspectRatio}>
              <SingleProductAsidePanel id="#item-aside-panel" ref={smartWrapperProps.asideContainerRef}>
                <SingleProductScreensContainer
                  $calculatedSizes={{
                    height: smartWrapperProps.asideContainerRef.current?.clientHeight,
                    width: smartWrapperProps.screensContainerNode?.clientWidth,
                  }}
                  ref={smartWrapperProps.setScreensContainerRef}
                  bgColor={product?.bgColor}
                  navLogo={product?.navLogo}
                  logo={product?.logo}
                >
                  <AsideWithVideo
                    {...smartWrapperProps}
                    product={product}
                    lockStatus={lockStatus}
                    isMobile={isMobile}
                    carousel={{ index: currentCarouselIndex, onChange: onCarouselChange }}
                  />
                </SingleProductScreensContainer>
              </SingleProductAsidePanel>
              <ShowcaseVideos
                videos={product.videos}
                forceLoad={isMobile}
                smartFill={SHOWCASE_ENABLED && !isMobile}
                hideVideo={isMobile || !!product?.noVideo}
                showPoster
                height={'100%'}
                zIndex={Z_INDEXES.BEHIND}
                firstPaintOver
                currentCarouselIndex={currentCarouselIndex}
                isMobileWidth={false}
              />
            </SingleProductContainer>
          </>
        )}
      </SinglePageSmartWrapper>
    </>
  )
}

/* 
const [searchParams] = useSearchParams()
  // TODO: use this properly
  useQueryProductById({
    id: getShopifyId(searchParams.get('skillId'), 'Product'),
    imageAmt: DEFAULT_CURRENT_COLLECTION_VARIABLES.imageAmt,
    videoAmt: DEFAULT_CURRENT_COLLECTION_VARIABLES.videoAmt,
  })
*/
