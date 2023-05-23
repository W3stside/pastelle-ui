import { Button, ButtonProps, Row, RowBetween } from '@past3lle/components'
import { Address } from '@past3lle/types'
import { truncateAddress } from '@past3lle/utils'
import { usePstlConnection, usePstlWeb3Modal } from '@past3lle/web3-modal'
import connectionIconDark from 'assets/images/connection-dark.png'
import connectionIconLight from 'assets/images/connection-light.png'
import disconnectionIconDark from 'assets/images/disconnection-dark.png'
import disconnectionIconLight from 'assets/images/disconnection-light.png'
import React, { useCallback } from 'react'
import styled, { useTheme } from 'styled-components/macro'
import { ThemeModes } from 'theme'

interface Props {
  children?: React.ReactNode
  logoUri?: string | null
  buttonProps?: ButtonProps
}

export function Web3LoginButton({ logoUri, buttonProps, children }: Props) {
  const [, { openW3Modal }, { address, isW3mOpen: isOpen }] = usePstlConnection()
  const { open } = usePstlWeb3Modal()

  const handleClick = useCallback(async () => {
    address ? openW3Modal({ route: 'Account' }) : open()
  }, [address, open, openW3Modal])

  const theme = useTheme()

  return (
    <Web3Button disabled={isOpen} onClick={handleClick} {...buttonProps}>
      <Row height="inherit" justifyContent="center" alignItems="center">
        {logoUri && <img src={logoUri} />}
        {address ? (
          <RowBetween>
            <img
              id="web3loginbutton-icon"
              src={theme?.mode === ThemeModes.DARK ? connectionIconDark : connectionIconLight}
            />
            {truncateAddress(address as Address)}
          </RowBetween>
        ) : (
          <>
            <img
              id="web3loginbutton-icon"
              src={theme?.mode === ThemeModes.DARK ? disconnectionIconDark : disconnectionIconLight}
            />
            {children}
          </>
        )}
      </Row>
    </Web3Button>
  )
}

export const Web3Button = styled(Button)`
  background: ${({ theme }) => (theme.mode === ThemeModes.DARK ? '#2d0023' : theme.offwhite)};
  color: ${({ theme }) => (theme.mode === ThemeModes.DARK ? theme.offwhite : '#2d0023')};
  height: 70%;
  font-size: 1.6rem;
  font-weight: 800;
  margin-left: auto;

  #web3loginbutton-icon {
    margin-right: 0.65rem;
    max-width: 2rem;
  }
`
