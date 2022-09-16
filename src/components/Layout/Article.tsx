import styled from 'styled-components/macro'
import { setCssBackground, upToExtraSmall } from 'theme/utils'
import { setFadeInAnimation } from 'theme/styles/animations'

const portugalBg = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}/portugal-bg_Rqj8jTKhFmds.jpg`

export const ArticleFadeInContainer = styled.article`
  position: relative;
  overflow: hidden;

  ${upToExtraSmall`
    padding-bottom: 4rem;
  `}

  ${({ theme }) =>
    setCssBackground(theme, {
      isLogo: false,
      imageUrls: [portugalBg, portugalBg],
      backgroundAttributes: ['center/contain', 'center/contain'],
      backgroundBlendMode: 'none'
    })}}
  
  filter: contrast(1) blur(0px);
  ${setFadeInAnimation()}
`
/* 
const BG_RATIO = 2.182
const BG_HEIGHT_RATIOS = {
  extraSmall: MEDIA_WIDTHS.upToExtraSmall / BG_RATIO,
  small: MEDIA_WIDTHS.upToSmall / BG_RATIO,
  medium: MEDIA_WIDTHS.upToMedium / BG_RATIO,
  large: MEDIA_WIDTHS.upToLarge / BG_RATIO,
  extraLarge: MEDIA_WIDTHS.upToExtraLarge / BG_RATIO
}
// load extra small size
  background-image: url(${portugalBg},w-${MEDIA_WIDTHS.upToExtraSmall},h-${
    BG_HEIGHT_RATIOS.extraSmall
  }), url(${portugalBgLq}:w-${MEDIA_WIDTHS.upToExtraSmall},h-${BG_HEIGHT_RATIOS.extraSmall});

// from small
  ${fromSmall`
    background-image: url(${portugalBg},w-${MEDIA_WIDTHS.upToSmall},h-${BG_HEIGHT_RATIOS.small}), url(${portugalBgLq}:w-${MEDIA_WIDTHS.upToSmall},h-${BG_HEIGHT_RATIOS.small});
  `}
  // from med
  ${fromMedium`
    background-image: url(${portugalBg},w-${MEDIA_WIDTHS.upToMedium},h-${BG_HEIGHT_RATIOS.medium}), url(${portugalBgLq}:w-${MEDIA_WIDTHS.upToMedium},h-${BG_HEIGHT_RATIOS.medium});
  `}
  // from large
  ${fromLarge`
    background-image: url(${portugalBg},w-${MEDIA_WIDTHS.upToLarge},h-${BG_HEIGHT_RATIOS.large}), url(${portugalBgLq}:w-${MEDIA_WIDTHS.upToLarge},h-${BG_HEIGHT_RATIOS.large});
  `}
  // from xl
  ${fromExtraLarge`
    background-image: url(${portugalBg},w-${MEDIA_WIDTHS.upToExtraLarge},h-${BG_HEIGHT_RATIOS.extraLarge}), url(${portugalBgLq}:w-${MEDIA_WIDTHS.upToExtraLarge},h-${BG_HEIGHT_RATIOS.extraLarge});
  `}

  background-size: contain;
*/
