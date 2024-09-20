import { ButtonProps, Column, SpecialThemedButtonProps } from '@past3lle/components'
import { SkillLockStatus } from '@past3lle/forge-web3'
import { useDetectScrollIntoView, useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import ActionButton from '@/components/AddToCartButton'
import { AddToCartButtonWrapper as ActionButtonWrapper, SingleProductScreen } from '@/pages/SingleProduct/styled'
import { ReactNode, memo, useRef } from 'react'

import { ProductSubHeader } from '../styleds'
import { BaseScreensProps } from './types'

interface ActionScreenProps extends BaseScreensProps {
  labels: {
    main: string
    async: string
  }
  callback: ((...params: any[]) => void) | undefined
  children?: ReactNode
  header?: string
  fixedWidth: number | undefined
  flags?: {
    hideLabels?: boolean
    hideVideoControls?: boolean
  }
  rootNode: HTMLElement | undefined | null
  fixedButtonStyles?: ButtonProps & SpecialThemedButtonProps
  staticButtonStyles?: ButtonProps & SpecialThemedButtonProps
}

// const TR_MID_URI = 'w-535,h-60'
const CTA_BUTTON_BG_URL = urlToSimpleGenericImageSrcSet(
  import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT +
    '/tr:w-535,h-60/s/files/1/0769/8510/6755/products/nav-bar_136c881a-0d35-494a-9c79-075ff7e67fda_500x.png.webp',
)
export default memo<ActionScreenProps>(function ShowcaseAndCtaComponent({
  callback,
  children,
  fixedWidth,
  flags,
  header,
  isMobile,
  palette,
  product,
  rootNode,
  skillInfo,
  fixedButtonStyles = {},
  staticButtonStyles = {},
  labels,
}: ActionScreenProps) {
  const { color } = palette
  const { variant } = product

  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const isInView = useDetectScrollIntoView(buttonRef.current, { root: rootNode, continuous: true }, !!rootNode)
  const isExtraSmall = useIsExtraSmallMediaWidth()

  const showSkillLockedUi = skillInfo !== null && skillInfo?.lockStatus === SkillLockStatus.LOCKED

  return (
    <SingleProductScreen padding="0">
      {/* Size selector */}
      {!flags?.hideLabels && header && (
        <ProductSubHeader useGradient bgColor={color} label={header} margin={isMobile ? '1rem 0' : '0'} />
      )}
      <Column margin="0" padding={'0 2rem'}>
        {children}
        <ActionButton
          ref={buttonRef}
          label={labels.main}
          asyncLabel={labels.async}
          product={variant}
          skillLocked={showSkillLockedUi}
          quantity={1}
          buttonProps={{
            bgImage: CTA_BUTTON_BG_URL,
            // TODO: remove type cast to any after next @past3lle/components version bump
            backgroundColor: color || '#000',
            width: '100%',
            fontSize: '2.5rem',
            ...staticButtonStyles,
          }}
          callback={callback}
        />

        {/* FIXED ADD TO CART BUTTON */}
        <ActionButtonWrapper isInView={isInView} width={(fixedWidth || 0) + 'px'}>
          <ActionButton
            label={labels.main}
            asyncLabel={labels.async}
            product={variant}
            skillLocked={showSkillLockedUi}
            quantity={1}
            buttonProps={{
              bgImage: CTA_BUTTON_BG_URL,
              backgroundColor: color || '#000',
              fontSize: isExtraSmall ? '7vw' : '3rem',
              fontWeight: 400,
              ...fixedButtonStyles,
            }}
            callback={callback}
          />
        </ActionButtonWrapper>
      </Column>
    </SingleProductScreen>
  )
})
