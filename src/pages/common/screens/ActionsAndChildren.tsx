import { ButtonProps, Column } from '@past3lle/components'
import { SkillLockStatus } from '@past3lle/forge-web3'
import { useDetectScrollIntoView } from '@past3lle/hooks'
import ActionButton from 'components/AddToCartButton'
import { AddToCartButtonWrapper as ActionButtonWrapper, SingleProductScreen } from 'pages/SingleProduct/styled'
import { ReactNode, memo, useRef } from 'react'

import { useShopifySrcSetToImageKitSrcSet } from '../../../hooks/useShopifySrcSetToImageKitSrcSet'
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
  fixedButtonStyles?: ButtonProps
  staticButtonStyles?: ButtonProps
}
const TR_MID_URI = 'w-535,h-60'
export default memo<ActionScreenProps>(function ShowcaseAndCtaComponent({
  callback,
  children,
  fixedWidth,
  flags,
  header,
  isMobile,
  metaContent,
  palette,
  product,
  rootNode,
  skillInfo,
  fixedButtonStyles = {},
  staticButtonStyles = {},
  labels,
}: ActionScreenProps) {
  const { color } = palette
  const { navLogo } = metaContent
  const { variant } = product

  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const isInView = useDetectScrollIntoView(buttonRef.current, { root: rootNode, continuous: true }, !!rootNode)

  const showSkillLockedUi = skillInfo !== null && skillInfo?.lockStatus === SkillLockStatus.LOCKED

  const mappedSrcSet = useShopifySrcSetToImageKitSrcSet(navLogo, TR_MID_URI)

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
            bgImage: mappedSrcSet,
            backgroundColor: color || '#000',
            width: '100%',
            fontSize: '2.2rem',
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
              bgImage: mappedSrcSet,
              backgroundColor: color || '#000',
              fontSize: '3rem',
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
