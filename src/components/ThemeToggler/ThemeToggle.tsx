import { Button, ButtonProps, ButtonSizeVariations, ButtonVariations } from '@past3lle/components'
import styled from 'styled-components/macro'
import { ThemeModes } from '@/theme'
import { ReactNode, FC } from 'react'

const ThemeButtonToggleWrapper = styled.div<{
  disabled: boolean
  $mode: boolean
  $margin?: string
  $width?: string
  $maxWidth?: string
  $height?: string
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${({ $width = '12rem' }): string => $width};
  max-width: ${({ $maxWidth = '120px' }): string => $maxWidth};
  height: ${({ $height = '3.5rem' }): string => $height};
  background-color: ${({ theme }) => (theme.mode !== ThemeModes.DARK ? theme.purple3 : theme.purple)};
  border-radius: 0.8rem;
  margin: ${({ $margin = '0' }): string => $margin};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  > ${Button} {
    border-radius: 0.8rem;
    width: 60%;
    height: 110%;
    margin-left: ${({ $mode }): string => ($mode ? 'auto' : '0')};

    display: flex;
    justify-content: center;
    align-items: center;

    > img,
    > svg {
      max-height: 100%;
    }

    #theme-toggle-label {
      position: absolute;
      color: ${({ theme }) => theme.offwhite};
      font-weight: 300;
      font-size: 1rem;
      max-width: 22%;
      ${({ $mode }) => ($mode ? 'left: 10%;' : 'right: 10%;')}
    }
  }
`

export interface ThemeToggleProps {
  margin?: string
  width?: string
  maxWidth?: string
  disabled?: boolean
  children?: ReactNode
}

export const ThemeToggle: FC<ThemeToggleProps & { mode: boolean; buttonProps: ButtonProps }> = ({
  mode,
  margin,
  width,
  maxWidth,
  disabled = false,
  buttonProps = { size: ButtonSizeVariations.SMALL, variant: ButtonVariations.THEME },
  children,
}) => {
  return (
    <ThemeButtonToggleWrapper
      disabled={disabled}
      $mode={mode}
      $margin={margin}
      $width={width}
      $maxWidth={maxWidth}
      title={`Tap/click to enable ${mode ? 'light' : 'dark'} mode`}
    >
      <Button height="100%" {...buttonProps}>
        {children}
      </Button>
    </ThemeButtonToggleWrapper>
  )
}
