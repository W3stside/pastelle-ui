import { ApolloError } from '@apollo/client'
import styled from 'styled-components/macro'
import { ItemSubHeader } from 'pages/SingleItem/styleds'

const ErrorWrapper = styled(ItemSubHeader)`
  background-color: ${({ theme }) => theme.dangerLight};
  border-radius: 1rem;
`

export default function ErrorMessage({ error }: { error: ApolloError | Error }) {
  return (
    <ErrorWrapper padding={'0 2rem'}>
      <p>Something went wrong!</p>
      <p>{error.message}</p>
    </ErrorWrapper>
  )
}
