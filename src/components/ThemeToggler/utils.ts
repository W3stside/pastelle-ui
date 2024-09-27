import { PNG_LogoCircle_2x } from '@past3lle/assets'
import { BSV, BV, ButtonProps } from '@past3lle/components'
import { ShopImageSrcSet } from '@/types'

export const getBaseButtonProps = (isDarkMode: boolean, toggleDarkMode: () => void): ButtonProps => ({
  size: BSV.DEFAULT,
  variant: BV.DARK_MODE_TOGGLE,
  // TODO: check this
  // @ts-expect-error - next static image error
  bgImage: { defaultUrl: PNG_LogoCircle_2x } as ShopImageSrcSet,
  backgroundColor: isDarkMode ? 'darkslategrey' : 'blue',
  filter: 'invert(' + isDarkMode ? '1' : '0' + ') contrast(2) saturate(2)',
  bgBlendMode: 'lighten',
  bgAttributes: ['0px / 10% repeat', '0px / 100% no-repeat'],
  onClick: toggleDarkMode,
})
