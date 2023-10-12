import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Column, Row } from '@past3lle/components'
import { SkillLockStatus, useW3UserConnectionInfo } from '@past3lle/forge-web3'
import { useBreadcrumb } from 'components/Breadcrumb'
import { TinyHelperTextStyled } from 'components/Common'
import useModelSizeSelector from 'components/ModelSizeSelector'
import useShowShowcase from 'components/Showcase/Settings'
import ShowcaseVideoControls from 'components/Showcase/Videos/Settings'
import useSizeSelector from 'components/SizeSelector'
import { SHOWCASE_ENABLED } from 'constants/config'
import { SmartWrapperNodesAndRefs } from 'pages/common'
import { useGetCommonPropsFromProduct as useMapToCommonPropsFromProduct } from 'pages/common/hooks/useGetCommonPropsFromProduct'
import * as Screens from 'pages/common/screens'
import {
  HighlightedText,
  PASTELLE_CREDIT,
  ProductArtistInfo,
  ProductCredits,
  ProductDescription,
  ProductSubHeader,
} from 'pages/common/styleds'
import { SingleProductPageProps as BaseProps } from 'pages/common/types'
import { useQueryProductVariantByKeyValue } from 'shopify/graphql/hooks'
import { useAppSelector } from 'state'
import { useGetSelectedProductShowcaseVideo } from 'state/collection/hooks'
import { useLargeImageModal, useSizeChartModal } from 'state/modalsAndPopups/hooks'
import { useThemeManager } from 'state/user/hooks'

type AuxProps = {
  lockStatus: SkillLockStatus
  isMobile: boolean
  carousel: {
    index: number
    onChange: (idx: number) => void
  }
}
export type SingleProductPageProps = { product: BaseProps } & AuxProps & SmartWrapperNodesAndRefs
export default function SingleProductPage(props: SingleProductPageProps) {
  const {
    product: {
      id,
      color = '#000',
      bgColor,
      artistInfo,
      sizes = [],
      images = [],
      lockedImages = [],
      videos = [],
      description,
    },
    carousel: { index: currentCarouselIndex, onChange: onCarouselChange },
    lockStatus,
    isMobile,
    screensContainerNode,
    asideContainerRef,
  } = props

  const { selectedSize } = useSizeSelector({ sizes })
  const variant = useQueryProductVariantByKeyValue({ productId: id, key: 'Size', value: selectedSize })
  // Mapped common props
  const commonProps = useMapToCommonPropsFromProduct({ ...props.product, variant, lockStatus, isMobile })

  // USER BLOCKCHAIN INFO
  const { address } = useW3UserConnectionInfo()
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
  const { SizeSelector } = useSizeSelector({ sizes })
  const { ModelSizeSelector } = useModelSizeSelector()

  const { mode } = useThemeManager()

  return (
    <>
      {/* SCREEN 1 - CAROUSEL & LOGO */}
      <Screens.AsideCarousel
        {...commonProps}
        carousel={{
          startIndex: currentCarouselIndex,
          images,
          lockedImages,
          videos: [selectedVideo],
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
      <Screens.ActionScreen
        {...commonProps}
        labels={{
          main: 'ADD TO CART',
          async: 'ADDING TO CART...',
        }}
        // undefined - use default add to cart
        callback={undefined}
        fixedWidth={screensContainerNode?.clientWidth}
        rootNode={asideContainerRef.current}
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
      </Screens.ActionScreen>

      {/* SCREEN 3 - ITEM INFO */}
      <Screens.Description {...commonProps} description={description} containerNode={screensContainerNode}>
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
                  <HighlightedText bgColor={color}>{PASTELLE_CREDIT}</HighlightedText>
                )}
              </ProductCredits>
            </Column>
          )}
        </>
      </Screens.Description>
    </>
  )
}

/* function _getScreenContentOffsetHeight(screenNode: HTMLElement, ratio: [number, number]) {
  const logoHeight = (screenNode.clientWidth * ratio[1]) / ratio[0]
  const headerAndPriceLabelHeights = LAYOUT_REM_HEIGHT_MAP.HEADER + LAYOUT_REM_HEIGHT_MAP.PRICE_LABEL * BASE_FONT_SIZE

  const offsetHeight = screenNode.clientHeight - (logoHeight + headerAndPriceLabelHeights)
  return offsetHeight < 0 ? undefined : offsetHeight
}
 */
