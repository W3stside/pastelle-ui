import { Column } from '@past3lle/components'
import { SkillLockStatus } from '@past3lle/forge-web3'
import { setBestTextColour } from '@past3lle/theme'
import { LAYOUT_REM_HEIGHT_MAP } from 'constants/sizes'
import { SingleProductScreen } from 'pages/SingleProduct/styled'
import { darken, transparentize } from 'polished'
import { ReactNode, memo } from 'react'
import { useTheme } from 'styled-components/macro'
import { ThemeModes } from 'theme'

import Logo from '../components/Logo'
import { ProductBackendDescription, ProductDescription, ProductSubHeader } from '../styleds'
import { BaseScreensProps, WithContainerNode } from './types'

interface DescriptionScreenProps extends BaseScreensProps, WithContainerNode {
  children?: ReactNode
  description: string
}
export const Description = memo<DescriptionScreenProps>(function DescriptionAndChildren({
  children,
  metaContent,
  palette,
  description,
  skillInfo,
  containerNode,
}: DescriptionScreenProps) {
  const { color } = palette
  const { logo, headerLogo, navLogo } = metaContent
  const { bgColor, altColor } = palette

  const { mode, content } = useTheme()

  return (
    <SingleProductScreen paddingBottom={LAYOUT_REM_HEIGHT_MAP.FIXED_ADD_TO_CART_BUTTON + 'rem'}>
      {/* Item description */}
      <ProductSubHeader
        useGradient
        bgColor={color}
        label={
          skillInfo?.lockStatus !== SkillLockStatus.LOCKED
            ? 'INFO & CARE INSTRUCTIONS'
            : 'DESCRIPTION: INFORMATION REDACTED'
        }
      />
      <Column padding="0 1.5rem">
        <Column
          overflow="hidden"
          borderRadius="1rem"
          backgroundColor={
            mode === ThemeModes.DARK ? content.background : transparentize(0.1, altColor || darken(0.02, color))
          }
        >
          <Logo
            id="product-logo__description"
            logoCss={`
                      filter: ${
                        mode === ThemeModes.DARK ? 'invert(1) hue-rotate(180deg)' : ''
                      } brightness(0.75) drop-shadow(0px -5px 5px ${mode === ThemeModes.DARK ? color : bgColor});
                      transform: rotate(180deg);
                      margin: 0 0 -12.5% 0;
                    `}
            logoBgAttributes={['bottom/contain no-repeat', 'bottom/contain no-repeat']}
            parentNode={containerNode}
            isCollectionView={false}
            logos={{ header: headerLogo, nav: navLogo, main: logo }}
          />
          {/* From shopify backened console */}
          {skillInfo?.lockStatus !== SkillLockStatus.LOCKED ? (
            <ProductBackendDescription
              dangerouslySetInnerHTML={{ __html: description }}
              padding="0rem 4rem 2rem"
              fontWeight={300}
              accentColor={bgColor}
              backgroundColor="transparent"
              color={mode === ThemeModes.DARK ? content.text : setBestTextColour(color)}
              css={`
                h1:first-of-type {
                  text-decoration: none;
                  font-size: 4rem;
                  > strong {
                    color: ${setBestTextColour(bgColor)};
                    background-color: ${bgColor};
                    font-weight: 100;
                    font-variation-settings: 'wght' 50;
                    padding: 0.25rem 1rem 0.25rem 0.55rem;
                  }
                }
              `}
            />
          ) : (
            <RedactedInformationDescription />
          )}
        </Column>
      </Column>
      {children}
    </SingleProductScreen>
  )
})

// component that renders "redacted" information for locked skills
const RedactedInformationDescription = (): JSX.Element => {
  return (
    <Column padding="0 1.5rem">
      <ProductDescription
        fontWeight={300}
        padding="0rem 4rem 1rem"
        color={'transparent'}
        css={`
          > * {
            background-color: indianred;
          }
        `}
      >
        <h1>REDACTED PRODUCT</h1>
        <p>This information is redacted until the skill is unlocked.</p>
        <p>Haha, nice try trying to change the font colour. We knew you&apos;d try.</p>
        <p>But there&apos;s no way to see the redacted product information until you unlock the skill!</p>
      </ProductDescription>
    </Column>
  )
}
