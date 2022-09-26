import { useState, useCallback, ReactNode } from 'react'
import { isMobile } from 'react-device-detect'
import { Z_INDEXES } from 'constants/config'
import { SubItemDescription } from 'pages/SingleItem/styleds'
import { BLACK } from 'theme/utils'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'
import { TinyHelperText } from 'components/Common'

export default function useShowShowcase() {
  const isMobileWidth = useIsMobileWindowWidthSize()
  const [showShowcase, setShowShowcase] = useState(false)
  const toggleShowcase = () => setShowShowcase(state => !state)

  const ShowcaseSettings = useCallback(
    ({ children }: { children?: ReactNode }) => (
      <SubItemDescription
        color={BLACK}
        padding="4rem 1.3rem 0.3rem"
        margin="-3rem auto 0"
        width="93%"
        fontWeight={300}
        fontSize="1.2rem"
        backgroundColor={'#e8e8e8'}
        style={{
          flexFlow: 'column nowrap',
          alignItems: 'flex-start',
          zIndex: Z_INDEXES.ZERO
        }}
      >
        {children}
        <TinyHelperText
          handleClick={toggleShowcase}
          label={showShowcase ? 'HIDE HOW-TO GUIDE' : 'SHOW HOW-TO GUIDE'}
          css={`
            padding: 0 1rem 1rem;
          `}
        />
        {showShowcase && (
          <small
            style={{
              backgroundColor: 'lightgoldenrodyellow',
              borderRadius: '1rem',
              padding: '1rem',
              margin: '-1rem 0 1rem',
              width: '100%'
            }}
          >
            Use showcase to view items in different sizes worn on different sized models.
            <br />
            <p>e.g</p>
            a. <strong>XL</strong> worn by our <strong>175cm</strong> tall <strong>female</strong> model
            <br />
            b. <strong>M</strong> worn by our <strong>185cm</strong> tall <strong>male</strong> model
            <p>Available filters below. Changes automatically update showcase videos.</p>
            <ul>
              <li>Select model height/gender via the toggles below.</li>
              <li>Select a different size</li>
              <li>Switch front/back views</li>
              <li>
                {isMobile || isMobileWidth
                  ? 'Tap the video anywhere'
                  : 'Click the gray button in the upper right hand corner'}{' '}
                to play/pause
              </li>
            </ul>
          </small>
        )}
      </SubItemDescription>
    ),
    [isMobileWidth, showShowcase]
  )

  return {
    ShowcaseSettings,
    toggleShowcase,
    showShowcase
  }
}
