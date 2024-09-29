import { ButtonVariations } from '@past3lle/components'
import SEO from '@/components/SEO'
import { ItemHeader, ProductSubHeader } from '@/components/pages-common/styleds'
import { useRouter } from 'next/router'
import { BackgroundWrapper, ContainerDiv, ButtonPrimary } from '@/components/404/styled'

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
          <ButtonPrimary onClick={() => navigate('/collection')} buttonVariant={ButtonVariations.WARNING}>
            <ProductSubHeader>View collection</ProductSubHeader>
          </ButtonPrimary>
        </ContainerDiv>
      </BackgroundWrapper>
    </>
  )
}
