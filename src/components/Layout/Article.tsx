import { ArticleFadeIn } from '@past3lle/components'
import { MediaWidths, setBackgroundWithDPI } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import styled from 'styled-components'
import { ThemeModes } from '@/theme'
import { ShopImageSrcSet } from '@/types'

export const portugalBg = `https://ik.imagekit.io/pastelle/portugal-bg_Rqj8jTKhFmds.jpg`

const LOGO_SET = [
  { defaultUrl: portugalBg } as ShopImageSrcSet,
  { defaultUrl: portugalBg } as ShopImageSrcSet,
  { defaultUrl: portugalBg } as ShopImageSrcSet,
]

export const ArticleFadeInContainer = styled(ArticleFadeIn)`
  ${({ theme }) =>
    setBackgroundWithDPI(theme, LOGO_SET, {
      dpiLevel: '1x',
      lqIkUrlOptions: {
        transforms: [
          (width?: number) => `pr-true,q-30${width && `,w-${width}`}`,
          (width?: number) => `pr-true,q-30${width && `,w-${width}`}`,
          'pr-true,q-10,w-10,h-10',
        ],
      },
      backgroundAttributes: ['center/contain no-repeat', '-1px -1px/contain repeat', 'center/cover no-repeat'],
      backgroundBlendMode: theme.mode === ThemeModes.DARK ? 'color-burn' : 'unset',
      backgroundColor: theme.mode === ThemeModes.DARK ? '#694c8430' : undefined,
    })}
`

export const ArticleFadeInWithBg = styled(ArticleFadeIn)<{ bgSet: GenericImageSrcSet<MediaWidths> }>`
  ${({ theme, bgSet }) =>
    setBackgroundWithDPI(theme, bgSet, {
      dpiLevel: '1x',
      lqIkUrlOptions: {
        transforms: [
          (width?: number) => `pr-true,q-30${width && `,w-${width}`}`,
          (width?: number) => `pr-true,q-30${width && `,w-${width}`}`,
          'pr-true,q-10,w-10,h-10',
        ],
      },
      backgroundAttributes: ['center/contain no-repeat', '-1px -1px/contain repeat', 'center/cover no-repeat'],
      backgroundBlendMode: theme.mode === ThemeModes.DARK ? 'difference' : 'unset',
    })}
`
