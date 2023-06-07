import { AutoColumn, ColumnCenter, ExternalLink, RowBetween, Text } from '@past3lle/components'
import { useW3Connection } from '@past3lle/forge-web3'
import Circle from 'assets/images/blue-loader.svg'
import { ReactNode } from 'react'
import { ArrowUpCircle } from 'react-feather'
import styled, { useTheme } from 'styled-components/macro'
import { CloseIcon, CustomLightSpinner } from 'theme'
import { getEtherscanLink } from 'utils/blockchain'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

export function LoadingView({ children, onDismiss }: { children: ReactNode; onDismiss: () => void }) {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        <>
          {children}
          <Text.SubHeader>Confirm this transaction in your wallet</Text.SubHeader>
        </>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}

export const SubmittedView: React.FC<{
  children?: ReactNode
  onDismiss: () => void
  hash: string | undefined
}> = ({ children, onDismiss, hash }) => {
  const theme = useTheme()
  const [, , { chain }] = useW3Connection()

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        <>
          {children}
          {chain?.id && hash && (
            <ExternalLink href={getEtherscanLink(chain.id, hash, 'transaction')} style={{ marginLeft: '4px' }}>
              <Text.SubHeader>View transaction on Etherscan</Text.SubHeader>
            </ExternalLink>
          )}
        </>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
