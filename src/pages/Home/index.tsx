import { SkillLockStatus } from '@past3lle/forge-web3'
import { useIsMobile } from '@past3lle/hooks'
import { OFF_WHITE } from '@past3lle/theme'
import SEO from 'components/SEO'
import { SelectedShowcaseVideo } from 'components/Showcase/Videos'
import { COLLECTION_PATHNAME } from 'constants/navigation'
import {
  SingleProductAsidePanel,
  SingleProductContainer,
  SingleProductScreensContainer,
} from 'pages/SingleProduct/styled'
import { SinglePageSmartWrapper } from 'pages/common'
import { CTA_BUTTON_PROP_THEMES } from 'pages/common/constants'
import { useGetCommonPropsFromProduct } from 'pages/common/hooks/useGetCommonPropsFromProduct'
import { useProductWebCarouselActions } from 'pages/common/hooks/useProductCarouselActions'
import { ProductSubHeader } from 'pages/common/styleds'
import { lazy, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryHomepage } from 'shopify/graphql/hooks'
import { getImageSizeMap } from 'shopify/utils'
import { useThemeManager } from 'state/user/hooks'
import { BLACK_TRANSPARENT_MORE } from 'theme'

const AsideCarousel = lazy(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "ASIDECAROUSEL" */ 'pages/common/screens/AsideCarousel')
)
const ActionScreen = lazy(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "ACTIONSCREEN" */ 'pages/common/screens/ActionsAndChildren')
)
const Description = lazy(
  () =>
    import(/* webpackPrefetch: true,  webpackChunkName: "DESCRIPTION" */ 'pages/common/screens/DescriptionAndChildren')
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

const OVERSIZED_CAROUSEL_MEDIA_WIDTH = '140%'

export default function Home() {
  const homepage = useQueryHomepage()

  const navigate = useNavigate()

  const { mode } = useThemeManager()
  const { onChange } = useProductWebCarouselActions({
    startIndex: 0,
  })

  const isMobile = useIsMobile()
  // Get common props for screens
  // lockStatus === null means ignore skill state
  const commonProps = useGetCommonPropsFromProduct({
    ...homepage,
    bgColor: homepage?.bgColor || BLACK_TRANSPARENT_MORE,
    color: homepage?.color || OFF_WHITE,
    altColor: homepage?.altColor || BLACK_TRANSPARENT_MORE,
    lockedImages: [],
    sizeChart: [],
    title: homepage?.title || 'PASTELLE',
    handle: homepage?.handle || 'PASTELLE',
    productType: '',
    variant: null,
    isMobile,
    lockStatus: SkillLockStatus.OWNED,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigateToCollection = useCallback(() => navigate(COLLECTION_PATHNAME), [])

  // Src-set of all images
  const imageSrcSet = useMemo(() => getImageSizeMap(homepage?.images || []), [homepage?.images])

  if (!homepage?.images?.length || !homepage?.videos?.length) return null

  return (
    <>
      <SEO title="HEAVY STREETWEAR" name="HEAVY STREETWEAR" description="PASTELLE. HEAVY STREETWEAR. PORTUGAL." />
      <SinglePageSmartWrapper>
        {({
          screensContainerNode,
          rootContainerNode,
          asideContainerRef,
          setScreensContainerRef,
          parentAspectRatio,
        }) => (
          <SingleProductContainer id="#item-container" parentAspectRatio={parentAspectRatio}>
            <SingleProductAsidePanel id="#item-aside-panel" ref={asideContainerRef}>
              <SingleProductScreensContainer
                $calculatedSizes={{
                  height: asideContainerRef.current?.clientHeight,
                  width: screensContainerNode?.clientWidth,
                }}
                ref={setScreensContainerRef}
                bgColor={homepage?.bgColor}
                navLogo={homepage?.navLogo}
                logo={homepage?.logo}
              >
                <AsideCarousel
                  {...commonProps}
                  containerNode={screensContainerNode}
                  carousel={{
                    touchAction: 'pan-y',
                    data: commonProps.isMobile ? [...homepage.videos, ...imageSrcSet] : imageSrcSet,
                    imageProps: {
                      style: {
                        maxWidth: OVERSIZED_CAROUSEL_MEDIA_WIDTH,
                      },
                    },
                    videoProps: {
                      height: 'auto',
                      width: OVERSIZED_CAROUSEL_MEDIA_WIDTH,
                    },
                    startIndex: 0,
                    onChange,
                    onCarouselItemClick: navigateToCollection,
                    indicatorOptions: {
                      showIndicators: true,
                    },
                  }}
                  themeMode={mode}
                  breadcrumbs={{
                    breadcrumbs: ['PASTELLE APPAREL'],
                    lastCrumb: '',
                  }}
                  skillInfo={null}
                  userAddress={undefined}
                  logoCss="filter: unset;"
                />
                <ActionScreen
                  {...commonProps}
                  labels={{
                    main: (isMobile ? 'TAP TO ' : '') + 'VIEW COLLECTION',
                    async: 'HEADING TO COLLECTION',
                  }}
                  skillInfo={null}
                  callback={navigateToCollection}
                  fixedWidth={screensContainerNode?.clientWidth}
                  rootNode={rootContainerNode}
                  fixedButtonStyles={CTA_BUTTON_PROP_THEMES.GLACIUS}
                  staticButtonStyles={CTA_BUTTON_PROP_THEMES.GLACIUS}
                >
                  <ProductSubHeader
                    fontWeight={100}
                    fontStyle="none"
                    css={`
                      > div {
                        width: max-content;
                        background-color: ${homepage.bgColor};
                        &:not(:last-child) {
                          margin: 0 0 4px;
                        }
                        padding: 2px 8px;
                      }
                    `}
                  >
                    <div>
                      <strong>GENES1S</strong> HEAVYWEIGHT COLLECTION
                    </div>
                    <div>AVAILABLE NOW</div>
                  </ProductSubHeader>
                </ActionScreen>
                <Description
                  {...commonProps}
                  header=""
                  containerNode={screensContainerNode}
                  description={homepage.description}
                />
              </SingleProductScreensContainer>
            </SingleProductAsidePanel>
            <SelectedShowcaseVideo
              forceLoad
              firstPaintOver
              isMobileWidth={false}
              smartFill={
                isMobile
                  ? undefined
                  : {
                      full: true,
                    }
              }
              hideVideo={false}
              css={VIDEO_CSS}
              currentCarouselIndex={0}
              selectedVideo={homepage.videos[0]}
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
