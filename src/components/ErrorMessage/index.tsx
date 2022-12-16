import { ApolloError } from '@apollo/client'
import styled from 'styled-components/macro'
import { ProductSubHeader } from 'pages/common/styleds'

const ErrorWrapper = styled(ProductSubHeader)`
  background-color: ${({ theme }) => theme.dangerLight};
  border-radius: ${({ theme }) => theme.buttons.borderRadius};
`

export default function ErrorMessage({ error }: { error: ApolloError | Error }) {
  return (
    <ErrorWrapper padding={'0 2rem'}>
      <p>Something went wrong!</p>
      <p>{error.message}</p>
    </ErrorWrapper>
  )
}
