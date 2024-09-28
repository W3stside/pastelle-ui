import { ArticleFadeIn, Button as ButtonPrimaryUnstyled, ButtonVariations } from '@past3lle/components'
import { setBackgroundWithDPI } from '@past3lle/theme'
import SEO from '@/components/SEO'
import { Z_INDEXES } from '@/constants/config'
import { ItemHeader, ProductSubHeader } from '@/components/pages-common/styleds'
import { transparentize } from 'polished'
import styled from 'styled-components/macro'
import { ShopImageSrcSet } from '@/types'
import { useRouter } from 'next/router'

const ButtonPrimary = styled(ButtonPrimaryUnstyled)``

const pastelle404IMG = 'https://ik.imagekit.io/pastelle/artists-mathieu_sgnA_QA83.jpeg'
const NOT_FOUND_SET = [
  {
    defaultUrl: pastelle404IMG,
    500: { '1x': pastelle404IMG + '?tr=pr-true,q-70,w-500' },
    720: { '1x': pastelle404IMG + '?tr=pr-true,q-70,w-720' },
    1280: { '1x': pastelle404IMG + '?tr=pr-true,q-70,w-1280' },
  } as ShopImageSrcSet,
]
const BackgroundWrapper = styled(ArticleFadeIn)`
  ${({ theme }) =>
    setBackgroundWithDPI(theme, NOT_FOUND_SET, {
      dpiLevel: '1x',
      backgroundAttributes: ['100% 0px/cover no-repeat'],
    })}
`
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
  const { push: navigate } = useRouter()

  return (
    <>
      <SEO
        title="404"
        name="404 | Not Found"
        description="Page not found!"
        cannonicalUrl="404"
        image={null}
        schema={null}
      />
      <BackgroundWrapper>
        <ContainerDiv>
          <ItemHeader itemColor="#000" animation={false} letterSpacing={-5}>
            PAGE NOT FOUND!
          </ItemHeader>
          <ItemHeader itemColor="#000" animation={false} letterSpacing={0} fontSize={'2.2rem'}>
            The page you are looking for does not exist{' '}
            <span style={{ fontSize: '3rem', fontStyle: 'normal' }}>ʕ ͡° ʖ̯ ͡°ʔ</span>
          </ItemHeader>
          <ButtonPrimary onClick={() => navigate('/')} buttonVariant={ButtonVariations.WARNING}>
            <ProductSubHeader>Back to the collection</ProductSubHeader>
          </ButtonPrimary>
        </ContainerDiv>
      </BackgroundWrapper>
    </>
  )
}
