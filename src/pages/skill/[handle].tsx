/* eslint-disable react-refresh/only-export-components */
import { useIsMobile } from '@past3lle/hooks'
import { devDebug } from '@past3lle/utils'
import SEO from '@/components/SEO'
import ShowcaseVideos from '@/components/Showcase/Videos'
import { Z_INDEXES } from '@/constants/config'
import { SHOWCASE_ENABLED } from '@/constants/flags'
import { SinglePageSmartWrapper } from '@/components/pages-common'
import { DEFAULT_MEDIA_START_INDEX } from '@/components/pages-common/constants'
import { useProductWebCarouselActions } from '@/components/pages-common/hooks/useProductCarouselActions'
import { useEffect } from 'react'
import { useUpdateCurrentlyViewingProduct } from '@/state/collection/hooks'

import AsideWithVideo from '../../components/Asides/skill/AsideWithVideo'
import { LargeProductAndSizeChartImagesCarousel } from '../../components/Asides/skill/LargeProductAndSizeChartCarousels'
import {
  SingleProductAsidePanel,
  SingleProductContainer,
  SingleProductScreensContainer,
} from '../../components/Asides/skill/styled'
import { useRouter } from 'next/router'
import { productsQuery, productByIdQuery } from '@/shopify/graphql/api/products'
import { BaseProductPageProps } from '@/components/pages-common/types'
import { mapShopifyProductToProps } from '@/shopify/utils'
import { BLACK } from '@past3lle/theme'

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const {
    products: { nodes },
  } = await productsQuery({
    amount: 20,
    imageAmt: 20,
    videoAmt: 20,
    query: "tag:COLLECTION-1"
  })

  // Get the paths we want to pre-render based on products
  const paths = nodes.map((node) => ({
    params: { handle: node.handle, id: node.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  let unformattedProduct
  // SCENARIO 1: missing ID in params, we need to get all products and find in list
  if (!params?.id) {
    const {
      products: { nodes },
    } = await productsQuery({
      amount: 20,
      imageAmt: 20,
      videoAmt: 20,
    })

    unformattedProduct = nodes.find((node) => node.handle === params.handle)
  }
  // SCENARIO 2: ID in params, just get product via ID
  else {
    // params contains the product `id`.
    // If the route is like /skill/1, then params.id is 1
    const { product: prod1 } = await productByIdQuery({
      id: params.id,
      imageAmt: 20,
      videoAmt: 5,
    })
    // assign
    unformattedProduct = prod1
  }

  if (!unformattedProduct) throw new Error('Missing product information with id ' + JSON.stringify(params.id))

  const [product] = mapShopifyProductToProps([unformattedProduct])

  // Pass post data to the page via props
  return { props: { product } }
}

interface Props {
  product: BaseProductPageProps | undefined
}

export default function SingleProductPage({ product }: Props) {
  // update state store with current browsing SINGLE product
  useUpdateCurrentlyViewingProduct(true, product)

  // MOBILE/WEB CAROUSEL
  const { currentIndex: currentCarouselIndex, onChange: onCarouselChange } = useProductWebCarouselActions({
    startIndex: DEFAULT_MEDIA_START_INDEX,
  })

  const isMobile = useIsMobile()
  const router = useRouter()

  useEffect(() => {
    // redirect if no product
    if (!product) {
      devDebug('No product, redirecting')
      router.push('/404')
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
              skillState={product.lockStatus}
            />
            <SingleProductContainer id="#item-container" parentAspectRatio={smartWrapperProps.parentAspectRatio}>
              <SingleProductAsidePanel id="#item-aside-panel" ref={smartWrapperProps.asideContainerRef}>
                <SingleProductScreensContainer
                  $calculatedSizes={{
                    height: smartWrapperProps.asideContainerRef.current?.clientHeight,
                    width: smartWrapperProps.screensContainerNode?.clientWidth,
                  }}
                  ref={smartWrapperProps.setScreensContainerRef}
                  bgColor={product?.bgColor || BLACK}
                  navLogo={product?.navLogo}
                  logo={product?.logo}
                >
                  <AsideWithVideo
                    {...smartWrapperProps}
                    {...product}
                    lockStatus={product.lockStatus}
                    isMobile={isMobile}
                    carousel={{ index: currentCarouselIndex, onChange: onCarouselChange }}
                  />
                </SingleProductScreensContainer>
              </SingleProductAsidePanel>
              <ShowcaseVideos
                videos={product.videos}
                forceLoad={isMobile}
                smartFill={SHOWCASE_ENABLED && !isMobile ? { side: true } : undefined}
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
