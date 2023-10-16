import { BaseCarouselProps } from '@past3lle/carousel'
import { SmartVideoProps } from '@past3lle/components'
import { SkillLockStatus } from '@past3lle/forge-web3'
import { ThemeSubModesRequired } from '@past3lle/theme'
import { getIsMobile as getIsMobileDevice } from '@past3lle/utils'
import { useBreadcrumb } from 'components/Breadcrumb'
import { Breadcrumbs } from 'components/Breadcrumbs'
import * as Carousels from 'components/Carousel/ProductCarousels'
import { Z_INDEXES } from 'constants/config'
import { SingleProductScreen } from 'pages/SingleProduct/styled'
import Logo from 'pages/common/components/Logo'
import { memo, useCallback, useMemo } from 'react'
import { getImageSizeMap } from 'shopify/utils'
import { ThemeModes } from 'theme'
import { Address } from 'viem'

import ProductPriceAndLabel from '../components/ProductPriceAndLabel'
import ProductRarityAndLabel from '../components/ProductRarityAndLabel'
import { useProductWebCarouselActions } from '../hooks/useProductCarouselActions'
import { ScrollingProductLabel } from '../styleds'
import { BaseProductPageProps } from '../types'
import { BaseScreensProps, WithContainerNode } from './types'

export interface AsideCarouselProps extends BaseScreensProps, WithContainerNode {
  carousel: Pick<BaseProductPageProps, 'images' | 'lockedImages' | 'videos'> &
    Pick<BaseCarouselProps<any>, 'onCarouselItemClick' | 'startIndex'> &
    Pick<ReturnType<typeof useProductWebCarouselActions>, 'onChange'> &
    Pick<SmartVideoProps, 'videoProps'>
  themeMode: ThemeSubModesRequired | 'DEFAULT'
  breadcrumbs: ReturnType<typeof useBreadcrumb> | null
  userAddress: Address | undefined
}
export const AsideCarousel = memo<AsideCarouselProps>(function AsideCarouselScreen({
  metaContent,
  palette,
  carousel,
  themeMode: mode,
  product,
  isMobile,
  breadcrumbs,
  containerNode,
  skillInfo,
  userAddress,
}: AsideCarouselProps) {
  const { headerLogo, logo, navLogo } = metaContent
  const { bgColor, color } = palette
  const { images, lockedImages, videos, startIndex, videoProps, onChange, onCarouselItemClick } = carousel
  const { shortDescription, title, variant } = product

  // PRODUCT/SIZE CHART IMAGES
  const imageUrls = useMemo(
    () => getImageSizeMap(skillInfo?.lockStatus === SkillLockStatus.LOCKED ? lockedImages : images),
    [images, lockedImages, skillInfo?.lockStatus]
  )

  const Carousel = useCallback(
    (props: Omit<Carousels.ProductSwipeCarousel, 'touchAction'>) =>
      getIsMobileDevice() ? (
        <Carousels.SwipeCarousel {...props} touchAction="pan-y" />
      ) : (
        <Carousels.ClickCarousel
          {...props}
          showButtons
          onCarouselItemClick={onCarouselItemClick}
          onCarouselChange={onChange}
        />
      ),
    // Ignore onCarouselChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCarouselItemClick]
  )

  return (
    <SingleProductScreen>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <ScrollingProductLabel logo={headerLogo} padding={'0.25rem'}>
          <Breadcrumbs {...breadcrumbs} color={bgColor} />
        </ScrollingProductLabel>
      )}
      {/* Product carousel */}
      <Carousel
        axis="x"
        data={isMobile ? [...imageUrls, ...videos] : imageUrls}
        startIndex={startIndex}
        colors={{ accent: color }}
        videoProps={videoProps}
        indicatorOptions={{
          showIndicators: true,
          position: 'top',
          barStyles: `
            width 95%;
            top: 11.3%;
            height: 3px;
            gap: 0.7rem;
            z-index: ${Z_INDEXES.MODALS + 1};
          `,
        }}
      />
      {/* DYNAMIC LOGO */}
      <Logo
        logoCss={`
                    filter: ${
                      mode === ThemeModes.DARK
                        ? `invert(1) saturate(1.4) hue-rotate(180deg) drop-shadow(0px 3px 7px ${bgColor})`
                        : `drop-shadow(0px 5px 5px ${bgColor})`
                    };
                  `}
        parentNode={containerNode}
        isCollectionView={false}
        logos={{ header: headerLogo, nav: navLogo, main: logo }}
      />
      <ProductPriceAndLabel variant={variant} color={color} title={title} shortDescription={shortDescription} />
      {skillInfo !== null && process.env.REACT_APP_USE_FORGE == 'true' && (
        <ProductRarityAndLabel
          lockStatus={skillInfo.lockStatus}
          variant={variant}
          title={`RARITY: ${skillInfo.metadata?.properties.rarity.toUpperCase() || 'COMMON'}`}
          shortDescription={
            skillInfo.lockStatus === SkillLockStatus.LOCKED
              ? !userAddress
                ? 'SKILL LOCKED - LOGIN TO VERIFY STATUS'
                : 'SKILL LOCKED - VIEW PREREQUISITES IN THE FORGE'
              : 'UNLOCKED! READ MORE IN THE FORGE SKILLBOOK'
          }
        />
      )}
    </SingleProductScreen>
  )
})
