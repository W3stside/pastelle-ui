import { COLLECTION_PATHNAME } from '@/constants/navigation'
import { getImageSizeMap } from '@/shopify/utils'
import { useThemeManager } from '@/state/user/hooks'
import { BLACK_TRANSPARENT_MORE } from '@/theme'
import { SkillLockStatus } from '@past3lle/forge-web3'
import { useIsMobile } from '@past3lle/hooks'
import { OFF_WHITE } from '@past3lle/theme'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { SingleProductAsidePanel, SingleProductScreensContainer } from '../Asides/skill/styled'
import { CTA_BUTTON_PROP_THEMES } from '../PagesComponents/constants'
import { useGetCommonPropsFromProduct } from '../PagesComponents/hooks/useGetCommonPropsFromProduct'
import { useProductWebCarouselActions } from '../PagesComponents/hooks/useProductCarouselActions'
import { ProductSubHeader } from '../PagesComponents/styleds'
import { SmartWrapperNodesAndRefs } from '../PagesComponents'
import { BaseProductPageProps } from '../PagesComponents/types'
import dynamic from 'next/dynamic'

const AsideCarousel = dynamic(
  () =>
    import(
      /* webpackPrefetch: true,  webpackChunkName: "ASIDECAROUSEL" */ '@/components/PagesComponents/screens/AsideCarousel'
    ),
)
const ActionScreen = dynamic(
  () =>
    import(
      /* webpackPrefetch: true,  webpackChunkName: "ACTIONSCREEN" */ '@/components/PagesComponents/screens/ActionsAndChildren'
    ),
  { ssr: false },
)
const Description = dynamic(
  () =>
    import(
      /* webpackPrefetch: true,  webpackChunkName: "DESCRIPTION" */ '@/components/PagesComponents/screens/DescriptionAndChildren'
    ),
  { ssr: false },
)

interface HomePageMainContentProps extends SmartWrapperNodesAndRefs {
  homepage: BaseProductPageProps
}
const OVERSIZED_CAROUSEL_MEDIA_WIDTH = '140%'
export default function HomepageMainContent({
  homepage,
  asideContainerRef,
  rootContainerNode,
  screensContainerNode,
  setScreensContainerRef,
}: HomePageMainContentProps) {
  const { push: navigate } = useRouter()

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
  return (
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
            data: isMobile ? [...homepage.videos, ...imageSrcSet] : imageSrcSet,
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
  )
}
