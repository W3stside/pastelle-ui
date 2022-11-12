import { useState, useCallback, ReactNode } from 'react'
import { isMobile } from 'react-device-detect'
import { Z_INDEXES } from 'constants/config'
import { SubItemDescription } from 'pages/SingleItem/styleds'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'
import { TinyHelperText } from 'components/Common'
import { TYPE } from 'theme'

export default function useShowShowcase() {
  const isMobileWidth = useIsMobileWindowWidthSize()
  const [showShowcase, setShowShowcase] = useState(false)
  const toggleShowcase = () => setShowShowcase(state => !state)

  const ShowcaseSettings = useCallback(
    ({ children }: { children?: ReactNode }) => (
      <SubItemDescription
        padding="5rem 1.3rem 0.3rem"
        margin="-4rem auto 2rem"
        width="100%"
        fontWeight={300}
        fontSize="1.2rem"
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
          <TYPE.black
            style={{
              backgroundColor: 'lightgoldenrodyellow',
              borderRadius: '1rem',
              padding: '1rem',
              margin: '-1rem 0 1rem',
              width: '100%'
            }}
          >
            Use the <strong>GENDER</strong> + <strong>HEIGHT</strong> filters above to view selected size worn on
            different sized/gender models.
            <br />
            <p>e.g</p>
            a. <strong>FEMALE</strong> model, <strong>175cm</strong> tall, wearing size <strong>L</strong>
            <br />
            b. <strong>MALE</strong> model, <strong>185cm</strong> tall, wearing size <strong>XL</strong>
            <p>Available filters below. Changes automatically update showcase videos.</p>
            <p>
              {isMobile || isMobileWidth
                ? 'Tap the video anywhere'
                : 'Click the gray button in the upper right hand corner'}{' '}
              to play/pause
            </p>
          </TYPE.black>
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
