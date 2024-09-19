import { TinyHelperText } from '@/components/Common'
import { Text as TYPE } from '@/components/Text'
import { Z_INDEXES } from '@/constants/config'
import { ProductSubDescription } from '@/pages/common/styleds'
import { ReactNode, useCallback, useState } from 'react'
import { useTheme } from 'styled-components/macro'
import { SHOWCASE_ENABLED } from '@/constants/flags'

export default function useShowShowcase() {
  const theme = useTheme()
  const [showShowcase, setShowShowcase] = useState(false)
  const toggleShowcase = () => setShowShowcase((state) => !state)

  const ShowcaseSettings = useCallback(
    ({ children }: { children?: ReactNode }) => (
      <ProductSubDescription
        padding={SHOWCASE_ENABLED ? `5rem 1.3rem 0.3rem` : '1.3rem'}
        margin={`${SHOWCASE_ENABLED ? '-4' : '0'}rem auto 1rem`}
        width="100%"
        fontWeight={300}
        fontSize="1.2rem"
        style={{
          flexFlow: 'column nowrap',
          alignItems: 'flex-start',
          zIndex: Z_INDEXES.ZERO,
        }}
      >
        {SHOWCASE_ENABLED && (
          <TinyHelperText
            handleClick={toggleShowcase}
            label={showShowcase ? 'Hide information' : 'What is showcase?'}
            css={`
              padding: 0 1rem;
            `}
          />
        )}

        {SHOWCASE_ENABLED && showShowcase && (
          <TYPE.Black
            style={{
              backgroundColor: theme.content.background,
              color: theme.content.text,
              borderRadius: '1rem',
              padding: '1rem',
              margin: '1rem 0 -1rem',
              width: '100%',
              borderLeft: '7px solid navajowhite',
            }}
          >
            Use the filters below to view different sizes on different types of models. Like your own personal runway
            show!
            <p>
              <strong>Changes automatically update showcase videos.</strong>
            </p>
          </TYPE.Black>
        )}

        {children}
      </ProductSubDescription>
    ),
    [showShowcase, theme.content.background, theme.content.text]
  )

  return {
    ShowcaseSettings,
    toggleShowcase,
    showShowcase,
  }
}
