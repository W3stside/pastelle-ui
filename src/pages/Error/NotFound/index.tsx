import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import ButtonPrimary from 'components/Button'
import { ItemHeader } from 'pages/SingleItem/styleds'
import MainImage from 'components/MainImage'

const pastelle404IMG = '/APPAREL/2022/FALL/REBIRTH/IMAGES/front-large_Xp_n4aZ6fdS.png'

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${ButtonPrimary} {
    width: 196px;
    padding: 9px;
    color: ${({ theme }) => theme.primaryText1};
    &:hover {
      ${({ theme }) => theme.bg5}
    }
  }
  h2 {
    margin: 36px 0 32px;
  }
  img {
    margin-top: 20px;
    max-width: 506px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img {
      max-width: 287px;
    }
    h2 {
      font-size: 16px;
      text-align: center;
    }
  `}
`

export default function NotFound() {
  return (
    <article>
      <Container>
        <ItemHeader itemColor="#000">PAGE NOT FOUND!</ItemHeader>
        <MainImage path={pastelle404IMG} />
        <h2>The page you are looking for does not exist. </h2>
        <ButtonPrimary as={Link} to={'/'}>
          Back home
        </ButtonPrimary>
      </Container>
    </article>
  )
}
