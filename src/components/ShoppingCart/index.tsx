import { Button, ButtonVariations, Column, SpinnerCircle } from '@past3lle/components'
import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import { WHITE } from '@past3lle/theme'
import LoadingRows from '@/components/Loader/LoadingRows'
import { DEFAULT_CART_LINES_AMOUNT } from '@/constants/config'
import { COLLECTION_PARAM_NAME, COLLECTION_PATHNAME } from '@/constants/navigation'
import { SearchParamQuickViews } from '@/constants/views'
import { ProductSubHeader } from '@/pages/common/styleds'
import { Suspense, lazy, useCallback, useState } from 'react'
import { ShoppingCart as ShoppingCartIcon, X } from 'react-feather'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryCart } from '@/shopify/graphql/hooks'
import { FragmentCartCostFragment, GetCartQuery } from '@/shopify/graphql/types'
import { useGetCartState, useToggleCartAndState } from '@/state/cart/hooks'
import { CartState } from '@/state/cart/reducer'
import { ThemeModes, getThemeColourByKey } from '@/theme'
import { formatShopifyCurrency } from 'utils/formatting'
import { checkIsCollectionPage } from 'utils/navigation'

import { LoadingCartLine } from './common'
import {
  CartHeader,
  CartTableHeaderBaseWrapper,
  CartTableHeaderWrapper,
  ShoppingCartFullWrapper,
  ShoppingCartHeaderWrapper,
  ShoppingCartPanelContentWrapper,
  ShoppingCartPanelWrapper,
  ShoppingCartQuantityWrapper,
} from './styled'
import { BoxProps } from 'rebass'

const ShoppingCart = lazy(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "SHOPPING_CART" */ '@/pages/ShoppingCart'),
)

const CartLine = lazy(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "SHOPPING_CART_LINE" */ 'components/ShoppingCart/CartLine'),
)

function ShoppingCartQuantity({ totalQuantity }: Pick<CartState, 'totalQuantity'>) {
  return <ShoppingCartQuantityWrapper>{totalQuantity}</ShoppingCartQuantityWrapper>
}

interface ShoppingCartHeaderProps {
  styleProps?: BoxProps
}
// Icon and count to show in header
export function ShoppingCartHeader(props: ShoppingCartHeaderProps) {
  const [, openOrCloseCart] = useToggleCartAndState()
  const cart = useGetCartState()

  const [searchParams] = useSearchParams()

  return (
    <ShoppingCartFullWrapper {...props?.styleProps}>
      <Suspense fallback={<ShoppingCartFallback />}>
        <ShoppingCartHeaderWrapper onClick={() => openOrCloseCart(true, cart)}>
          <ShoppingCartIcon size={30} />
          <ShoppingCartQuantity totalQuantity={cart.totalQuantity} />
        </ShoppingCartHeaderWrapper>
        {searchParams.get('peek') === SearchParamQuickViews.CART && <ShoppingCart />}
      </Suspense>
    </ShoppingCartFullWrapper>
  )
}

function ShoppingCartFallback() {
  return (
    <ShoppingCartHeaderWrapper>
      <ShoppingCartIcon size={30} />
      <SpinnerCircle size={23} />
    </ShoppingCartHeaderWrapper>
  )
}

export function ShoppingCartPanel({ cartId, closeCartPanel }: { cartId: string; closeCartPanel: () => void }) {
  const { data, loading } = useQueryCart({ cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT })
  const cartLines = data?.cart?.lines.nodes
  const totalQuantity = data?.cart?.totalQuantity
  const subTotal = data?.cart?.cost.subtotalAmount

  const [checkoutClicked, setCheckoutClicked] = useState(false)

  const isEmptyCart = !cartLines?.length

  const location = useLocation()
  const navigate = useNavigate()

  const isCollectionPage = checkIsCollectionPage(location)

  const handleNavClick = useCallback(() => {
    closeCartPanel()
    navigate(COLLECTION_PATHNAME)
  }, [closeCartPanel, navigate])

  const isMobileWidth = useIsExtraSmallMediaWidth()

  return (
    <ShoppingCartPanelWrapper>
      {/* CART HEADER */}
      <CartTableHeader data={data} totalQuantity={totalQuantity} subTotal={subTotal} closeCartPanel={closeCartPanel} />

      {/* CART LINES */}
      <ShoppingCartPanelContentWrapper>
        {loading ? (
          <CartLoadingRow rows={3} />
        ) : isEmptyCart ? (
          <ProductSubHeader color={WHITE} fontSize="2.5rem" fontWeight={400} padding={0} margin="2rem 0">
            <span id="lenny-face">Your cart is</span> <strong>empty</strong> <span id="lenny-face">ʕ ͡° ʖ̯ ͡°ʔ</span>
            {!isCollectionPage && (
              <p onClick={handleNavClick} style={{ cursor: 'pointer' }}>
                <u>Check out the full {COLLECTION_PARAM_NAME}</u>!
              </p>
            )}
          </ProductSubHeader>
        ) : (
          cartLines?.map((line) => (
            <Suspense key={line.id} fallback={<CartLineFallback key={line.id} />}>
              <CartLine key={line.id} line={line} />
            </Suspense>
          ))
        )}
      </ShoppingCartPanelContentWrapper>

      {/* CHECKOUT */}
      {data?.cart?.checkoutUrl && data?.cart?.totalQuantity > 0 && (
        <CartTableHeaderBaseWrapper
          justifyContent="space-evenly"
          flexWrap="wrap"
          css={`
            > * {
              flex: 1;
              min-width: 25rem;
              &:first-of-type {
                min-width: 20rem;
              }
              &:last-child {
                flex: 2;
              }
            }
          `}
        >
          {subTotal && (
            <CartHeader fontSize="3.5rem" letterSpacing={0.2} justifyContent="center" textAlign="left">
              <div style={{ fontSize: 'small', marginLeft: '0.5rem' }}>total:</div>
              <div>
                {formatShopifyCurrency(subTotal.amount, {
                  locales: [navigator.language || 'pt-PT'],
                  currency: subTotal.currencyCode,
                })}
              </div>
            </CartHeader>
          )}
          <Button
            backgroundColor={getThemeColourByKey(ThemeModes.DARK, 'purple2', 'purple') as string}
            buttonVariant={ButtonVariations.SUCCESS}
            disabled={checkoutClicked}
            padding="0"
          >
            <CartHeader
              display="flex"
              margin="0"
              letterSpacing={-1.3}
              fontSize={isMobileWidth ? '2rem' : '2.6rem'}
              fontWeight={100}
            >
              <a
                href={data.cart.checkoutUrl}
                style={{
                  color: 'ghostwhite',
                  width: '100%',
                  height: '100%',
                  padding: '1rem',
                }}
                onClick={() => setCheckoutClicked(true)}
              >
                {checkoutClicked ? 'Redirecting to checkout...' : 'Checkout'}
              </a>
            </CartHeader>
          </Button>
        </CartTableHeaderBaseWrapper>
      )}
    </ShoppingCartPanelWrapper>
  )
}

function CartLoadingRow({ rows = 1 }: { rows?: number }) {
  return (
    <LoadingRows
      rows={rows}
      $height="11rem"
      $padding="1rem"
      $margin="1rem 0"
      $borderRadius="1rem"
      component={<LoadingCartLine />}
    />
  )
}

function CartLineFallback() {
  return <CartLoadingRow />
}

function CartTableHeader({
  totalQuantity,
  closeCartPanel,
}: {
  data: GetCartQuery | undefined
  totalQuantity: number | undefined
  subTotal: FragmentCartCostFragment['subtotalAmount'] | undefined
  closeCartPanel: () => void
}) {
  return (
    <CartTableHeaderWrapper>
      <CartHeader margin="1rem auto 0 0" letterSpacing={-6} fontSize="6rem">
        CART
      </CartHeader>
      {/* <Strikethrough /> */}
      <Column>
        {!!totalQuantity && (
          <CartHeader fontSize="3.5rem" letterSpacing={0}>
            {!totalQuantity || totalQuantity > 1 ? `${totalQuantity} items` : '1 item'}
          </CartHeader>
        )}
      </Column>
      <X size={'5rem'} color={WHITE} onClick={closeCartPanel} />
    </CartTableHeaderWrapper>
  )
}
