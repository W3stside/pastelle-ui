import { Button, ButtonSizeVariations, ButtonVariations, Row } from '@past3lle/components'
import { ikUrlToSimpleImageSrcSet, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import LOGO from 'assets/svg/pastelle-cursive-logo.svg'
import useLogo from '@/components/BackgroundLogo'
import { ArticleFadeInWithBg } from '@/components/Layout'
import SEO from '@/components/SEO'
import { ProductDescription, ProductScreen, ProductSubHeader } from '@/pages/common/styleds'
import { transparentize } from 'polished'
import { useCallback } from 'react'
import { getThemeColours } from '@/theme'

const bgSrcSet = ikUrlToSimpleImageSrcSet('https://ik.imagekit.io/SHOP/PICTURES/error_picture')

export function AppErrorFallback() {
  const {
    Logo,
    ref: { setRef },
  } = useLogo({ src: LOGO, isHeader: false })

  const handleClick = useCallback(() => {
    localStorage.clear()
    window.location.reload()
  }, [])

  return (
    <>
      <SEO title="APP ERROR" name="APP ERROR" description="Top-level app error" />
      <ArticleFadeInWithBg id="APP-ERROR-ARTICLE" bgSet={bgSrcSet}>
        <ProductScreen height="100%" padding="10%">
          <Row ref={setRef} height="50%" justifyContent="center" style={{ position: 'relative' }}>
            <Logo />
          </Row>
          <ProductSubHeader fontSize={'8rem'}>OOOOPS!</ProductSubHeader>

          <ProductDescription
            fontSize={'3rem'}
            padding="2rem"
            backgroundColor={transparentize(0.25, getThemeColours('DEFAULT').red2 || 'darkred')}
          >
            <p>Something went wrong!</p>
            <p>
              It may be that your app version is out of date. Please click the button below to attempt and resolve this
              issue.
            </p>
            <br />
            <Button
              buttonVariant={ButtonVariations.THEME}
              buttonSize={ButtonSizeVariations.BIG}
              onClick={handleClick}
              margin={'auto'}
              width={'40%'}
              height={'10rem'}
              bgImage={urlToSimpleGenericImageSrcSet('https://ik.imagekit.io/pastelle/SHOP/PICTURES/error_picture')}
              backgroundColor={getThemeColours('DEFAULT').purple1}
            >
              <strong style={{ fontSize: '3rem' }}>Clear cache and reload</strong>
            </Button>
            <br />
            <p style={{ fontSize: '2rem' }}>
              If the issue persists, please contact us at{' '}
              <a href="mailto: pastelle.portugal@gmail.com">pastelle.portugal@gmail.com</a>
            </p>
          </ProductDescription>
        </ProductScreen>
      </ArticleFadeInWithBg>
    </>
  )
}
