import { Button as ButtonPrimary, ButtonVariations, SmartImg } from '@past3lle/components'
import { Z_INDEXES } from 'constants/config'
import { ItemHeader, ProductSubHeader } from 'pages/common/styleds'
import { transparentize } from 'polished'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'

const pastelle404IMG = 'https://ik.imagekit.io/pastelle/artists-mathieu_sgnA_QA83.jpeg'

const ContainerDiv = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 0rem 5rem 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  background-color: ${({ theme }) => transparentize(0.2, theme.black)};

  ${ButtonPrimary} {
    width: 80%;
    padding: 9px;
    margin: 2rem;
  }

  img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: ${Z_INDEXES.BEHIND};
  }
  h2 {
    font-size: 1.6rem;
    text-align: center;
  }
`

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <article>
      <ContainerDiv>
        <ItemHeader itemColor="#000" animation={false} letterSpacing={-5}>
          PAGE NOT FOUND!
        </ItemHeader>
        <SmartImg path={{ ikPath: pastelle404IMG }} transformation={[{ pr: true }]} />
        <ItemHeader itemColor="#000" animation={false} letterSpacing={0} fontSize={'2.2rem'}>
          The page you are looking for does not exist{' '}
          <span style={{ fontSize: '3rem', fontStyle: 'normal' }}>ʕ ͡° ʖ̯ ͡°ʔ</span>
        </ItemHeader>
        <ButtonPrimary onClick={() => navigate('/')} variant={ButtonVariations.WARNING}>
          <ProductSubHeader>Back to the collection</ProductSubHeader>
        </ButtonPrimary>
      </ContainerDiv>
    </article>
  )
}
