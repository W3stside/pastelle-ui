import { Column, Row } from '@past3lle/components'
import { useOnResize } from '@past3lle/hooks'
import { WHITE } from '@past3lle/theme'
import LoadingRows from 'components/Loader/LoadingRows'
import ThemeToggleBar from 'components/ThemeToggler'
import { ProductSubHeader } from 'pages/common/styleds'
import { BaseProductPageProps } from 'pages/common/types'
import { Fragment, memo, useCallback, useMemo, useState } from 'react'
import { Menu, X } from 'react-feather'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Product } from 'shopify/graphql/types/_generated_'
import { useDeriveCurrentCollection, useGetCurrentOnScreenCollectionProduct } from 'state/collection/hooks'
import { ProductPageMap } from 'state/collection/reducer'
import { URLFlowType, getFlowParams } from 'state/collection/updater'
import { getThemeColours } from 'theme'
import { buildItemUrl } from 'utils/navigation'

import packageJSON from '../../../package.json'
import { CollectionSelector } from './CollectionSelector'
import { CollectionLabel, InnerNavWrapper, MobileNavOrb, NavigationStepsWrapper, SideEffectNavLink } from './styled'

export type MobileNavProps = { menuSize?: number; bgColor?: string }

export default function Navigation({
  navOrbProps,
  mobileHide,
}: {
  navOrbProps?: MobileNavProps
  mobileHide?: boolean
}) {
  const navigate = useNavigate()
  // state collection data
  const currentCollection = useDeriveCurrentCollection()
  const currentProduct = useGetCurrentOnScreenCollectionProduct()

  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = useCallback(() => {
    if (isNavOpen) {
      setIsNavOpen(false)
    } else {
      setIsNavOpen(true)
    }
  }, [isNavOpen])

  const NavToggleButton = useMemo(() => {
    return (
      <Row alignItems={'center'} gap="1rem">
        {isNavOpen ? <X size={20} /> : <Menu size={navOrbProps?.menuSize || 20} />}
      </Row>
    )
  }, [isNavOpen, navOrbProps?.menuSize])

  const handleNavMove = useCallback(
    (
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      product: Pick<BaseProductPageProps, 'handle'> | 'collection'
    ) => {
      e.preventDefault()

      isNavOpen && toggleNav()

      navigate(product === 'collection' ? 'collection' : buildItemUrl(product.handle))
    },
    [navigate, isNavOpen, toggleNav]
  )

  // groups products by their product type
  // e.g { LONGSLEEVE: [VOODOO, VIRGIL] ... }
  const productTypeMap = useGroupCollectionByType(currentCollection?.products)

  // check search params to show different nav menu
  const [searchParams] = useSearchParams()
  const isDirectReferralView = getFlowParams(searchParams)

  // close open nav on resize
  useOnResize(() => setIsNavOpen(false), isNavOpen)

  return (
    <>
      <MobileNavOrb onClick={toggleNav} mobileHide={mobileHide} {...navOrbProps}>
        {NavToggleButton}
      </MobileNavOrb>
      <NavigationStepsWrapper
        isOpen={isNavOpen}
        minWidth="9vw"
        width="16.5rem"
        currentMedia={{ navLogoSet: currentProduct?.navLogo, color: currentProduct?.color }}
        // ref={setNodeRef}
      >
        {/* <NavLogo parentNode={parentNode} logoSrcSet={currentProduct?.navLogo} /> */}
        <InnerNavWrapper $width={isNavOpen ? '90%' : '100%'}>
          <CollectionSelector />
          <Column>
            {currentCollection ? (
              Object.entries(productTypeMap)
                .reverse()
                .map(([type, productList], i) => (
                  <Fragment key={i}>
                    <ProductSubHeader
                      color={WHITE}
                      padding="0"
                      margin="0.5rem 0 0.2rem 0"
                      fontSize={isNavOpen ? '4rem' : '1.6rem'}
                      fontWeight={800}
                    >
                      {type.toLocaleUpperCase()}S
                    </ProductSubHeader>
                    {productList.map((product) => (
                      <NavItemMemoed
                        key={product.id}
                        product={product}
                        currentProduct={currentProduct}
                        handleNavMove={handleNavMove}
                        isNavOpen={isNavOpen}
                      />
                    ))}
                  </Fragment>
                ))
            ) : (
              <LoadingRows rows={6} />
            )}
            {isDirectReferralView?.type === URLFlowType.SKILL && (
              <ProductSubHeader
                color={WHITE}
                padding="0"
                margin="1.2rem 0 0.2rem 0"
                fontSize={isNavOpen ? '4rem' : '1.6rem'}
                fontWeight={200}
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleNavMove(e, 'collection')}
              >
                FULL COLLECTION
              </ProductSubHeader>
            )}
          </Column>
        </InnerNavWrapper>
        <InnerNavWrapper
          margin="auto auto 1rem auto"
          padding="1.5rem 1rem"
          alignItems={'center'}
          bgColor="transparent"
          $width={isNavOpen ? '90%' : '100%'}
        >
          <div>
            <ThemeToggleBar themeToggleProps={{ width: '90%' }} />
          </div>
        </InnerNavWrapper>
        <Row width="100%">
          <strong style={{ padding: '0.5rem', backgroundColor: getThemeColours('DEFAULT').blackLight, width: '100%' }}>
            Version: {packageJSON.version}
          </strong>
        </Row>
      </NavigationStepsWrapper>
    </>
  )
}

type ProductTypeMap = { [key: Product['productType']]: Pick<BaseProductPageProps, 'id' | 'title' | 'handle'>[] }
function useGroupCollectionByType(collection?: ProductPageMap): ProductTypeMap {
  return useMemo(
    () =>
      !collection
        ? {}
        : Object.values(collection).reduce((prev, product) => {
            if (product.productType) {
              const productTypeList = prev[product.productType]
              prev[product.productType] = [
                ...(productTypeList || []),
                { title: product.title, handle: product.handle, id: product.id },
              ]
            }
            return prev
          }, {} as ProductTypeMap),
    [collection]
  )
}
const NavProductLine = ({
  product,
  currentProduct,
  handleNavMove,
  isNavOpen,
}: {
  isNavOpen: boolean
  handleNavMove: any
  currentProduct: any
  product: Pick<BaseProductPageProps, 'id' | 'title' | 'handle'>
}) => (
  <SideEffectNavLink key={product.id} onClick={(e) => handleNavMove(e, product)}>
    <ProductSubHeader
      width={'100%'}
      padding="2px 0"
      margin="0"
      color={WHITE}
      fontWeight={100}
      fontSize={isNavOpen ? '3.5rem' : '1.6rem'}
    >
      <CollectionLabel
        isNavOpen={isNavOpen}
        active={product.id === currentProduct?.id}
        bgColor={currentProduct?.bgColor}
        justifyContent={isNavOpen ? 'end' : 'start'}
      >
        {product.title}
      </CollectionLabel>
    </ProductSubHeader>
  </SideEffectNavLink>
)
const NavItemMemoed = memo(NavProductLine, (prevProps, nextProps) => {
  return prevProps.currentProduct?.id === nextProps.currentProduct?.id && prevProps.isNavOpen === nextProps.isNavOpen
})
