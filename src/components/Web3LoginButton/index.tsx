import { Button, ButtonProps, Row } from '@past3lle/components'
import { truncateAddress } from '@past3lle/utils'
import { useWeb3Modal } from '@web3modal/react'
import React, { useCallback } from 'react'
import styled from 'styled-components/macro'
import { ThemeModes } from 'theme'
import { useAccount } from 'wagmi'

interface Props {
  children?: React.ReactNode
  logoUri?: string | null
  buttonProps?: ButtonProps
}

export function Web3LoginButton({ logoUri, buttonProps, children }: Props) {
  const { address } = useAccount()
  const { open, isOpen } = useWeb3Modal()

  const handleClick = useCallback(async () => {
    open({ route: address ? 'Account' : 'ConnectWallet' })
  }, [open, address])

  return (
    <Web3Button disabled={isOpen} onClick={handleClick} {...buttonProps}>
      <Row height="inherit" justifyContent={'center'} alignItems="center">
        {logoUri && <img src={logoUri} />}
        {address ? truncateAddress(address) : children}
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
`
