import { ArticleFadeIn } from '@past3lle/components'
import { ThemeModes, setBackgroundWithDPI } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import styled from 'styled-components/macro'

export const portugalBg = `https://ik.imagekit.io/portugal-bg_Rqj8jTKhFmds.jpg`

const LOGO_SET = [
  { defaultUrl: portugalBg } as GenericImageSrcSet,
  { defaultUrl: portugalBg } as GenericImageSrcSet,
  { defaultUrl: portugalBg } as GenericImageSrcSet
]

export const ArticleFadeInContainer = styled(ArticleFadeIn)`
  ${({ theme }) =>
    setBackgroundWithDPI(theme, LOGO_SET, {
      dpiLevel: '1x',
      lqIkUrlOptions: {
        transforms: [
          (width?: number) => `pr-true,q-30${width && `,w-${width}`}`,
          (width?: number) => `pr-true,q-30${width && `,w-${width}`}`,
          'pr-true,q-10,w-10,h-10'
        ]
      },
      backgroundAttributes: ['center/contain no-repeat', '-1px -1px/contain repeat', 'center/cover no-repeat'],
      backgroundBlendMode: theme.mode === ThemeModes.DARK ? 'difference' : 'unset'
    })}
`
