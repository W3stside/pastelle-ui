import styled from 'styled-components/macro'
import { setCssBackground, upToExtraSmall } from 'theme/utils'
import { setFadeInAnimation } from 'theme/styles/animations'
import { ThemeModes } from 'theme/styled'
import { GenericImageSrcSet } from 'components/Carousel'

export const portugalBg = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}/portugal-bg_Rqj8jTKhFmds.jpg?tr=pr-true,`

export const ArticleFadeInContainer = styled.article`
  position: relative;
  overflow: hidden;
  touch-actions: none;

  ${upToExtraSmall`
    padding-bottom: 4rem;
  `}

  ${({ theme }) =>
    setCssBackground(theme, {
      imageUrls: [
        { defaultUrl: portugalBg + 'q-40' } as GenericImageSrcSet,
        { defaultUrl: portugalBg + 'q-40' } as GenericImageSrcSet,
        { defaultUrl: portugalBg + 'q-20,w-10,h-10' } as GenericImageSrcSet
      ],
      backgroundAttributes: ['center/contain no-repeat', '-1px -1px/contain repeat', 'center/cover no-repeat'],
      backgroundBlendMode: theme.mode === ThemeModes.DARK ? 'difference' : 'unset'
    })}}
  
  // required for fade in animation
  filter: contrast(1) blur(0px);
  ${setFadeInAnimation()}
`
