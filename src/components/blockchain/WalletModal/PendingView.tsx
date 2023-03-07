import { Trans } from '@lingui/macro'
import { Button, Column, ColumnCenter, RowCenter, Text as ThemedText } from '@past3lle/components'
import { Connector } from '@web3-react/types'
import Loader from 'components/Loader'
import styled from 'styled-components/macro'

const PendingSection = styled(ColumnCenter)`
  width: 100%;
  & > * {
    width: 100%;
  }
`

const LoaderContainer = styled(RowCenter)`
  margin: 16px 0;
`

const LoadingMessage = styled(RowCenter)`
  border-radius: ${({ theme }) => theme.button.border.radius};

  & > * {
    padding: 1rem;
  }
`

const ErrorGroup = styled(Column)`
  align-items: center;
  justify-content: flex-start;
`

const LoadingWrapper = styled(Column)`
  align-items: center;
  justify-content: center;
`

export default function PendingView({
  connector,
  error = false,
  tryActivation,
  openOptions,
}: {
  connector: Connector
  error?: boolean
  tryActivation: (connector: Connector) => void
  openOptions: () => void
}) {
  return (
    <PendingSection>
      <LoadingMessage>
        <LoadingWrapper>
          {error ? (
            <ErrorGroup>
              <ThemedText.MediumHeader marginBottom={12}>
                <Trans>Error connecting</Trans>
              </ThemedText.MediumHeader>
              <ThemedText.Body fontSize={14} marginBottom={36} textAlign="center">
                <Trans>
                  The connection attempt failed. Please click try again and follow the steps to connect in your wallet.
                </Trans>
              </ThemedText.Body>
              <Button
                borderRadius="12px"
                padding="12px"
                onClick={() => {
                  tryActivation(connector)
                }}
              >
                <Trans>Try Again</Trans>
              </Button>
              <Button padding="0" marginTop={20}>
                <ThemedText.Link fontSize={12} onClick={openOptions}>
                  <Trans>Back to wallet selection</Trans>
                </ThemedText.Link>
              </Button>
            </ErrorGroup>
          ) : (
            <>
              <ThemedText.Black fontSize={20} marginY={16}>
                <LoaderContainer>
                  <Loader stroke="currentColor" size="32px" />
                </LoaderContainer>
                <Trans>Connecting...</Trans>
              </ThemedText.Black>
            </>
          )}
        </LoadingWrapper>
      </LoadingMessage>
    </PendingSection>
  )
}
