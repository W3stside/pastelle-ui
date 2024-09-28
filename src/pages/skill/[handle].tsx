/* eslint-disable react-refresh/only-export-components */
import { useIsMobile } from '@past3lle/hooks'
import SEO from '@/components/SEO'
import ShowcaseVideos from '@/components/Showcase/Videos'
import { PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT, Z_INDEXES } from '@/constants/config'
import { SHOWCASE_ENABLED } from '@/constants/flags'
import { SinglePageSmartWrapper } from '@/components/pages-common'
import { DEFAULT_MEDIA_START_INDEX } from '@/components/pages-common/constants'
import { useProductWebCarouselActions } from '@/components/pages-common/hooks/useProductCarouselActions'
import { useUpdateCurrentlyViewingProduct } from '@/state/collection/hooks'

import AsideWithVideo from '../../components/Asides/skill/AsideWithVideo'
import { LargeProductAndSizeChartImagesCarousel } from '../../components/Asides/skill/LargeProductAndSizeChartCarousels'
import {
  SingleProductAsidePanel,
  SingleProductContainer,
  SingleProductScreensContainer,
} from '../../components/Asides/skill/styled'
import { queryProductPaths, queryProducts } from '@/shopify/graphql/api/products'
import { BaseProductPageProps } from '@/components/pages-common/types'
import { mapShopifyProductToProps } from '@/shopify/utils'
import { BLACK } from '@past3lle/theme'
import { ProductSchema } from '@/components/SEO/types'
import { getProductSeoSchema } from '@/components/SEO/utils'
import { DEFAULT_PRODUCT_DESCRIPTION } from '@/components/SEO/constants'

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const {
    products: { nodes },
  } = await queryProductPaths('tag:COLLECTION-1')

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
  const {
    products: { nodes },
  } = await queryProducts({
    amount: 1,
    imageAmt: PRODUCT_IMAGES_AMOUNT,
    videoAmt: PRODUCT_VIDEOS_AMOUNT,
    query: params?.handle ? `title:${params.handle}` : `id:${params.id}`,
  })

  if (!nodes?.[0]) throw new Error('Missing product information with id ' + JSON.stringify(params.id))

  const [product] = mapShopifyProductToProps(nodes)

  // Pass post data to the page via props
  return { props: { product, schemaSEO: getProductSeoSchema(product) } }
}

interface Props {
  product: BaseProductPageProps | undefined
  schemaSEO: ProductSchema | null
}

export default function SingleProductPage({ product, schemaSEO }: Props) {
  // update state store with current browsing SINGLE product
  useUpdateCurrentlyViewingProduct(true, product)

  // MOBILE/WEB CAROUSEL
  const { currentIndex: currentCarouselIndex, onChange: onCarouselChange } = useProductWebCarouselActions({
    startIndex: DEFAULT_MEDIA_START_INDEX,
  })

  const isMobile = useIsMobile()

  if (!product || !schemaSEO) return null

  return (
    <>
      <SEO
        name={product.handle.toUpperCase()}
        title={product.seo.title || `${product.handle.toUpperCase()} | PASTELLE APPAREL`}
        description={product.seo.description || product.description || product.shortDescription || DEFAULT_PRODUCT_DESCRIPTION}
        image={product.images?.[0].url1280_2x}
        cannonicalUrl={`skill/${product.handle}`}
        schema={schemaSEO}
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
