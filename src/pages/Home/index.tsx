import { useIsMobile } from '@past3lle/hooks'
import SEO from 'components/SEO'
import { SelectedShowcaseVideo } from 'components/Showcase/Videos'
import { COLLECTION_PATHNAME } from 'constants/navigation'
import {
  SingleProductAsidePanel,
  SingleProductContainer,
  SingleProductScreensContainer,
} from 'pages/SingleProduct/styled'
import { SinglePageSmartWrapper } from 'pages/common'
import { useGetCommonPropsFromProduct } from 'pages/common/hooks/useGetCommonPropsFromProduct'
import { useProductWebCarouselActions } from 'pages/common/hooks/useProductCarouselActions'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryHomepage } from 'shopify/graphql/hooks'
import { useThemeManager } from 'state/user/hooks'

import * as Screens from '../common/screens'

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
    bgColor: homepage?.bgColor || 'red',
    color: homepage?.bgColor || 'red',
    altColor: homepage?.bgColor || 'red',
    lockedImages: [],
    sizeChart: [],
    title: homepage?.title || 'PASTELLE',
    handle: homepage?.handle || 'PASTELLE',
    productType: '',
    variant: null,
    isMobile,
    lockStatus: null,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigateToCollection = useCallback(() => navigate(COLLECTION_PATHNAME), [])

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
          <>
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
                  <Screens.AsideCarousel
                    {...commonProps}
                    containerNode={screensContainerNode}
                    carousel={{
                      touchAction: 'pan-y',
                      images: homepage.images,
                      lockedImages: [],
                      videos: [],
                      startIndex: 0,
                      onChange,
                      onCarouselItemClick: alert,
                      indicatorOptions: {
                        showIndicators: true,
                      },
                    }}
                    themeMode={mode}
                    breadcrumbs={null}
                    skillInfo={null}
                    userAddress={undefined}
                    logoCss="filter: unset;"
                  />
                  <Screens.ActionScreen
                    {...commonProps}
                    labels={{
                      main: 'VIEW COLLECTION',
                      async: 'HEADING TO COLLECTION',
                    }}
                    skillInfo={null}
                    callback={navigateToCollection}
                    fixedWidth={screensContainerNode?.clientWidth}
                    rootNode={rootContainerNode}
                  >
                    <br />
                  </Screens.ActionScreen>
                  <Screens.Description
                    {...commonProps}
                    header="WHO ARE WE?"
                    containerNode={screensContainerNode}
                    description={homepage.description}
                  />
                </SingleProductScreensContainer>
              </SingleProductAsidePanel>
              <SelectedShowcaseVideo
                forceLoad
                firstPaintOver
                isMobileWidth={false}
                smartFill={{
                  full: true,
                }}
                hideVideo={false}
                css={VIDEO_CSS}
                currentCarouselIndex={0}
                selectedVideo={homepage.videos[0]}
                videoProps={{
                  loop: false,
                }}
              />
            </SingleProductContainer>
          </>
        )}
      </SinglePageSmartWrapper>
    </>
  )
}
