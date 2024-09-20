import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Column, Row } from '@past3lle/components'
import { SkillLockStatus, useW3UserConnectionInfo } from '@past3lle/forge-web3'
import { useBreadcrumb } from '@/components/Breadcrumb'
import { TinyHelperTextStyled } from '@/components/Common'
import useModelSizeSelector from '@/components/ModelSizeSelector'
import useShowShowcase from '@/components/Showcase/Settings'
import ShowcaseVideoControls from '@/components/Showcase/Videos/Settings'
import useSizeSelector from '@/components/SizeSelector'
import { PLACEHOLDER_HIGHLIGHT_COLOUR } from '@/constants/config'
import { FORGE_WEB3_ENABLED, SHOWCASE_ENABLED } from '@/constants/flags'
import { SmartWrapperNodesAndRefs } from '@/pages/common'
import { CTA_BUTTON_PROP_THEMES } from '@/pages/common/constants'
import { useGetCommonPropsFromProduct as useMapToCommonPropsFromProduct } from '@/pages/common/hooks/useGetCommonPropsFromProduct'
import {
  HighlightedText,
  PastelleCredit,
  ProductArtistInfo,
  ProductCredits,
  ProductDescription,
  ProductSubHeader,
} from '@/pages/common/styleds'
import { SingleProductPageProps as BaseProps } from '@/pages/common/types'
import { lazy, useMemo } from 'react'
import { useQueryProductVariantByKeyValue } from '@/shopify/graphql/hooks'
import { getImageSizeMap } from '@/shopify/utils'
import { useAppSelector } from '@/state'
import { useGetSelectedProductShowcaseVideo } from '@/state/collection/hooks'
import { useLargeImageModal, useSizeChartModal } from '@/state/modalsAndPopups/hooks'
import { useThemeManager } from '@/state/user/hooks'

const AsideCarousel = lazy(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "ASIDECAROUSEL" */ '@/pages/common/screens/AsideCarousel'),
)
const ActionScreen = lazy(
  () =>
    import(/* webpackPrefetch: true,  webpackChunkName: "ACTIONSCREEN" */ '@/pages/common/screens/ActionsAndChildren'),
)
const Description = lazy(
  () =>
    import(
      /* webpackPrefetch: true,  webpackChunkName: "DESCRIPTION" */ '@/pages/common/screens/DescriptionAndChildren'
    ),
)

export type SingleProductPageProps = BaseProps & SmartWrapperNodesAndRefs
export default function SingleProductPage(props: SingleProductPageProps) {
  const {
    carousel: { index: currentCarouselIndex, onChange: onCarouselChange },
    lockStatus,
    isMobile,
    screensContainerNode,
    asideContainerRef,
    ...product
  } = props

  const {
    id,
    color = '#000',
    bgColor = PLACEHOLDER_HIGHLIGHT_COLOUR,
    artistInfo,
    sizes = [],
    images = [],
    lockedImages = [],
    videos = [],
    description,
  } = product

  const { selectedSize, SizeSelector } = useSizeSelector({ sizes })
  const variant = useQueryProductVariantByKeyValue({ productId: id, key: 'Size', value: selectedSize })
  // Mapped common props
  const commonProps = useMapToCommonPropsFromProduct({ ...product, variant, lockStatus, isMobile })

  // USER BLOCKCHAIN INFO
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { address } = (FORGE_WEB3_ENABLED && useW3UserConnectionInfo()) || { address: undefined }
  // FORGE related user skill state
  const skillState = commonProps.skillInfo?.lockStatus

  // MODALS
  const { toggleModal: toggleLargeImageModal } = useLargeImageModal()
  const { toggleModal: toggleSizeChartModal } = useSizeChartModal()

  // ARE VIDEOS SET TO AUTOPLAY?
  const { autoplay: autoPlay } = useAppSelector((state) => state.user.showcase.videoSettings)

  /// BREADCRUMBS
  const breadcrumbs = useBreadcrumb()

  // SELECTED SHOWCASE VIDEO
  const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })

  const { ShowcaseSettings } = useShowShowcase()
  const { ModelSizeSelector } = useModelSizeSelector()

  const { mode } = useThemeManager()

  // Src-set of all images
  const imageSrcSet = useMemo(
    () => getImageSizeMap(lockStatus === SkillLockStatus.LOCKED ? lockedImages : images),
    [lockedImages, lockStatus, images],
  )

  return (
    <>
      {/* SCREEN 1 - CAROUSEL & LOGO */}
      <AsideCarousel
        {...commonProps}
        carousel={{
          touchAction: 'pan-y',
          data: isMobile ? [...imageSrcSet, selectedVideo] : imageSrcSet,
          startIndex: currentCarouselIndex,
          videoProps: {
            autoPlay,
          },
          onChange: onCarouselChange,
          onCarouselItemClick: toggleLargeImageModal,
        }}
        themeMode={mode}
        breadcrumbs={breadcrumbs}
        containerNode={screensContainerNode}
        userAddress={address}
      />

      {/* SCREEN 2 - SHOWCASE */}
      <ActionScreen
        {...commonProps}
        labels={{
          main: 'ADD TO CART',
          async: 'ADDING TO CART...',
        }}
        // undefined - use default add to cart
        callback={undefined}
        fixedWidth={screensContainerNode?.clientWidth}
        rootNode={asideContainerRef.current}
        fixedButtonStyles={CTA_BUTTON_PROP_THEMES.GLACIUS}
        staticButtonStyles={CTA_BUTTON_PROP_THEMES.GLACIUS}
      >
        {/* SHOWCASE MODEL SHOWCASE SETTINGS */}
        {skillState !== SkillLockStatus.LOCKED && (
          <>
            {SHOWCASE_ENABLED && (
              <ProductDescription fontWeight={300} padding="1rem 1.8rem" margin="1rem 0 0" style={{ zIndex: 1 }}>
                <Row gap="1rem">
                  <FontAwesomeIcon icon={faLightbulb} /> SHOWCASE SETTINGS
                </Row>
              </ProductDescription>
            )}
            <ShowcaseSettings>
              {<ShowcaseVideoControls isMobile={false} margin="1rem auto 0" width="100%" />}
              {/* MOBILE SHOWCASE */}
              {SHOWCASE_ENABLED && <ModelSizeSelector />}
              {/* PRODUCT SIZE SELECTOR */}
              {!!sizes.length && <SizeSelector color={bgColor} margin="0" />}
              <TinyHelperTextStyled margin={'0.5rem 0 0.5rem 1rem'} onClick={toggleSizeChartModal}>
                SIZE CHART
              </TinyHelperTextStyled>
            </ShowcaseSettings>
          </>
        )}
      </ActionScreen>

      {/* SCREEN 3 - ITEM INFO */}
      <Description
        {...commonProps}
        header="INFO & CARE INSTRUCTIONS"
        description={description}
        containerNode={screensContainerNode}
      >
        <>
          {/* Credits */}
          <ProductSubHeader
            useGradient
            bgColor={color}
            label={skillState !== SkillLockStatus.LOCKED ? 'CREDIT WHERE CREDIT IS DUE' : undefined}
            margin="2rem 0"
          />
          {skillState !== SkillLockStatus.LOCKED && (
            <Column padding={'0 3rem'}>
              <ProductCredits>
                {artistInfo ? (
                  <ProductArtistInfo {...artistInfo} bgColor={color} />
                ) : (
                  <HighlightedText bgColor={color}>{PastelleCredit}</HighlightedText>
                )}
              </ProductCredits>
            </Column>
          )}
        </>
      </Description>
    </>
  )
}
