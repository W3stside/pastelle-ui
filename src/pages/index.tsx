/* eslint-disable react-refresh/only-export-components */
import SEO from '@/components/SEO'
import { SelectedShowcaseVideo } from '@/components/Showcase/Videos'
import { SingleProductContainer } from '@/components/Asides/skill/styled'
import { mapShopifyHomepageToProps } from '@/shopify/utils'
import dynamic from 'next/dynamic'
import { homeQuery } from '@/shopify/graphql/api/home'
import { ProductSchema } from '@/components/SEO/types'
import { getProductSeoSchema } from '@/components/SEO/utils'
import { AnimatedPastelleLoader } from '@/components/Loader'
import HomepageMainContent from '@/components/Homepage/HomePageClientContent'
import { wrapper } from '@/state'
import { updateCurrentlyViewing, updateHomepage } from '@/state/collection/reducer'

const SinglePageSmartWrapper = dynamic(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "HOMESMARTWRAPPER" */ '@/components/PagesComponents'),
  { ssr: false, loading: () => <AnimatedPastelleLoader /> },
)

const VIDEO_CSS = `
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  z-index: 0;

  > div {
    height: 75%;
  }
`

// This also gets called at build time
export const getStaticProps = wrapper.getStaticProps((store) => async (): Promise<{ props: Props }> => {
  const { product: homeRaw } = await homeQuery()

  if (!homeRaw) throw new Error('Missing homepage data!')
  const homepage = homeRaw ? mapShopifyHomepageToProps(homeRaw) : null

  if (homepage) {
    store.dispatch(updateHomepage(homepage))
    store.dispatch(updateCurrentlyViewing({ handle: 'pastelle', id: 'gid://shopify/Product/8818646909251' }))
  }

  // Pass post data to the page via props
  return { props: { homepage, schemaSEO: getProductSeoSchema(homepage) } }
})

type Props = {
  homepage: ReturnType<typeof mapShopifyHomepageToProps> | null
  schemaSEO: ProductSchema | null
}

export default function Home({ homepage, schemaSEO }: Props) {
  if (!homepage || !schemaSEO) return null

  return (
    <>
      <SEO
        title="Organic Avant-Garde Streetwear | PASTELLE APPAREL"
        name="PASTELLE APPAREL"
        description="Discover avant-garde streetwear made from organic materials. Designed by local artists in Portugal, PASTELLE APPAREL's heavyweight pieces (250gsm+) redefine urban fashion."
        image=""
        cannonicalUrl=""
        schema={schemaSEO}
      />
      <SinglePageSmartWrapper>
        {({ parentAspectRatio, ...restProps }) => (
          <SingleProductContainer id="#item-container" parentAspectRatio={parentAspectRatio}>
            <HomepageMainContent {...restProps} homepage={homepage} parentAspectRatio={parentAspectRatio} />
            <SelectedShowcaseVideo
              forceLoad
              firstPaintOver
              isMobileWidth={false}
              hideVideo={false}
              css={VIDEO_CSS}
              currentCarouselIndex={0}
              // Flag in CLI sets video quality. false = 12mb hq and true = 3mb lq
              selectedVideo={homepage.videos[process.env.NEXT_PUBLIC_SHOW_LQ_HOME_VIDEO ? 1 : 0]}
              videoProps={{
                loop: false,
              }}
            />
          </SingleProductContainer>
        )}
      </SinglePageSmartWrapper>
    </>
  )
}
