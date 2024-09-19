import { Button, ButtonProps, Row, RowBetween } from '@past3lle/components'
import { useW3AccountNetworkActions, useW3Modal, useW3UserConnectionInfo } from '@past3lle/forge-web3'
import { Address } from '@past3lle/types'
import { truncateAddress } from '@past3lle/utils'
import connectionIconDark from 'assets/images/connection-dark.png'
import connectionIconLight from 'assets/images/connection-light.png'
import disconnectionIconDark from 'assets/images/disconnection-dark.png'
import disconnectionIconLight from 'assets/images/disconnection-light.png'
import React from 'react'
import styled, { useTheme } from 'styled-components/macro'
import { ThemeModes } from '@/theme'
import { FORGE_WEB3_ENABLED } from '@/constants/flags'
interface Props {
  children?: React.ReactNode
  logoUri?: string | null
  buttonProps?: ButtonProps
}

export function Web3LoginButton({ logoUri, buttonProps, children }: Props) {
  const { onAccountClick } = useW3AccountNetworkActions()
  const { isOpen } = useW3Modal()
  const { address } = useW3UserConnectionInfo()

  const theme = useTheme()

  // Flag enabled/disabled
  if (!FORGE_WEB3_ENABLED) return null

  return (
    <Web3Button disabled={isOpen} onClick={onAccountClick} {...buttonProps}>
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
  background: ${({ theme }) => theme.content.background};
  color: ${({ theme }) => theme.content.text};
  // filter: ${({ theme }) => (theme.mode === ThemeModes.DARK ? 'invert(1)' : 'invert(0)')};
  height: 70%;
  font-size: 1.6rem;
  font-weight: 800;
  margin-left: auto;

  &:disabled,
  &[disabled] {
    background-color: ${({ theme }) => (theme.mode === ThemeModes.DARK ? '#c3c3c3a6' : '#c2c2c2ad')};
  }

  #web3loginbutton-icon {
    margin-right: 0.65rem;
    max-width: 2rem;
  }
`
