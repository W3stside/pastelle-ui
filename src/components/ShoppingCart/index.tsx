import { Button, ButtonVariations, Column, Row, SmartImg } from '@past3lle/components'
import { useCleanTimeout, usePrevious } from '@past3lle/hooks'
import { WHITE } from '@past3lle/theme'
import LoadingRows from 'components/Loader/LoadingRows'
import { DEFAULT_CART_LINES_AMOUNT } from 'constants/config'
import { COLLECTION_PARAM_NAME, COLLECTION_PATHNAME } from 'constants/navigation'
import { SearchParamQuickViews } from 'constants/views'
import useQuantitySelector from 'hooks/useQuantitySelector'
import ShoppingCart from 'pages/ShoppingCart'
import { ProductSubHeader } from 'pages/common/styleds'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ShoppingCart as ShoppingCartIcon, X } from 'react-feather'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryCart } from 'shopify/graphql/hooks'
import { FragmentCartCostFragment, FragmentCartLineFragment, GetCartQuery, ProductSizes } from 'shopify/graphql/types'
import { getMetafields, sizeToFullSize } from 'shopify/utils'
import {
  useGetCartState,
  useRemoveCartLineAndUpdateReduxCallback,
  useToggleCartAndState,
  useUpdateCartLineAndUpdateReduxCallback,
} from 'state/cart/hooks'
import { CartState } from 'state/cart/reducer'
import { useOnScreenProductHandle } from 'state/collection/hooks'
import { ThemeModes, getThemeColourByKey } from 'theme'
import { formatShopifyCurrency } from 'utils/formatting'
import { buildItemUrl, checkIsCollectionPage } from 'utils/navigation'

import {
  CartHeader,
  CartLineContent,
  CartLineWrapper,
  CartTableHeaderBaseWrapper,
  CartTableHeaderWrapper,
  ShoppingCartFullWrapper,
  ShoppingCartHeaderWrapper,
  ShoppingCartPanelContentWrapper,
  ShoppingCartPanelWrapper,
  ShoppingCartQuantityWrapper,
} from './styled'

function ShoppingCartQuantity({ totalQuantity }: Pick<CartState, 'totalQuantity'>) {
  return <ShoppingCartQuantityWrapper>{totalQuantity}</ShoppingCartQuantityWrapper>
}

// Icon and count to show in header
export function ShoppingCartHeader() {
  const [, openOrCloseCart] = useToggleCartAndState()
  const cart = useGetCartState()

  const [searchParams] = useSearchParams()

  return (
    <ShoppingCartFullWrapper>
      <ShoppingCartHeaderWrapper onClick={() => openOrCloseCart(true, cart)}>
        <ShoppingCartIcon size={30} />
        <ShoppingCartQuantity totalQuantity={cart.totalQuantity} />
      </ShoppingCartHeaderWrapper>
      {/* SHOW CART IF PARAMS DETECT CART */}
      {searchParams.get('peek') === SearchParamQuickViews.CART && <ShoppingCart />}
    </ShoppingCartFullWrapper>
  )
}

export function ShoppingCartPanel({ cartId, closeCartPanel }: { cartId: string; closeCartPanel: () => void }) {
  const { data, loading } = useQueryCart({ cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT })
  const cartLines = data?.cart?.lines.nodes
  const totalQuantity = data?.cart?.totalQuantity
  const subTotal = data?.cart?.cost.subtotalAmount

  const [checkoutClicked, setCheckoutClicked] = useState(false)

  const isEmptyCart = !Boolean(cartLines?.length)

  const location = useLocation()
  const navigate = useNavigate()

  const isCollectionPage = checkIsCollectionPage(location)

  const handleNavClick = useCallback(() => {
    closeCartPanel()
    navigate(COLLECTION_PATHNAME)
  }, [closeCartPanel, navigate])

  return (
    <ShoppingCartPanelWrapper>
      {/* CART HEADER */}
      <CartTableHeader data={data} totalQuantity={totalQuantity} subTotal={subTotal} closeCartPanel={closeCartPanel} />

      {/* CART LINES */}
      <ShoppingCartPanelContentWrapper>
        {loading ? (
          <LoadingRows rows={3} $height="11rem" $padding="1rem" $margin="1rem 0" $borderRadius="1rem" />
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
          cartLines?.map((line) => <CartLine key={line.id} line={line} />)
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
            <CartHeader display="flex" margin="0" letterSpacing={-2} fontSize="2.8rem">
              <a
                href={data.cart.checkoutUrl}
                style={{ width: '100%', height: '100%', padding: '1rem' }}
                onClick={() => setCheckoutClicked(true)}
              >
                {checkoutClicked ? <small style={{ fontSize: '2rem' }}>redirecting to checkout...</small> : 'CHECKOUT'}
              </a>
            </CartHeader>
          </Button>
        </CartTableHeaderBaseWrapper>
      )}
    </ShoppingCartPanelWrapper>
  )
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

function CartLine({ line }: { line: FragmentCartLineFragment }) {
  const { updateCartLineCallback } = useUpdateCartLineAndUpdateReduxCallback()
  const { removeCartLineCallback } = useRemoveCartLineAndUpdateReduxCallback()

  const cleanTimeout = useCleanTimeout()
  const [removeLineLoading, setRemoveOperationLoading] = useState(false)

  const { QuantitySelector, quantity } = useQuantitySelector({
    defaultQuantity: line.quantity,
    onTrashClick: line.id
      ? (e: React.MouseEvent<SVGElement, MouseEvent>) => {
          e.stopPropagation()
          setRemoveOperationLoading(true)
          removeCartLineCallback(
            { lineIds: [line.id] },
            {
              onCompleted: () => {
                cleanTimeout(() => setRemoveOperationLoading(false), 1000)
              },
            }
          )
        }
      : undefined,
  })

  const previousQuantity = usePrevious(line.quantity)
  const wasPreviousAndChanged = !!previousQuantity && previousQuantity !== quantity
  const selectionIsValidQuantity = Number(quantity)

  const { color, handle, images } = line.merchandise.product

  const { bgLogo, color: itemColor } = useMemo(
    () => ({
      bgLogo: images.nodes?.find(
        (node) => node.altText === 'LOGO' || node.altText === 'HEADER' || node.altText === 'NAVBAR'
      )?.url500,
      color: getMetafields<string>(color),
    }),
    [color, images.nodes]
  )

  const navigate = useNavigate()
  const handleClick = useCallback(() => {
    const url = buildItemUrl(handle)
    navigate(url)
  }, [navigate, handle])

  useEffect(() => {
    if (removeLineLoading || !line.id) return
    else if (selectionIsValidQuantity && wasPreviousAndChanged) {
      updateCartLineCallback({ quantity, lineId: line.id })
    }
  }, [line.id, quantity, selectionIsValidQuantity, updateCartLineCallback, removeLineLoading, wasPreviousAndChanged])

  const sizeFull = line?.merchandise.size ? sizeToFullSize(line.merchandise.size as ProductSizes) : null
  const collectionCurrentProduct = useOnScreenProductHandle()

  return (
    <CartLineWrapper bgLogo={bgLogo} color={itemColor}>
      <div>
        {/* 1 */}
        {/* <SMART IMG SPAN />*/}
        {/* 2 */}
        <SmartImg path={{ defaultPath: images.nodes[0].url125 }} onClick={handleClick} />
        {/* 3 */}
        <CartLineContent onClick={handleClick}>
          <Row>
            <ProductSubHeader color={WHITE} fontSize="3rem" fontWeight={1000} padding={0} margin={0}>
              {line?.merchandise.product.title}
            </ProductSubHeader>
            <ProductSubHeader color={WHITE} fontSize="1.5rem" fontWeight={300} padding={0} margin={0}>
              {sizeFull} {sizeFull && `(${line?.merchandise.size})`}
            </ProductSubHeader>
            {collectionCurrentProduct?.handle !== handle && (
              <ProductSubHeader color={WHITE} fontSize="1.5rem" fontWeight={300} padding={0} margin={0}>
                tap or click to view item
              </ProductSubHeader>
            )}
          </Row>
          <QuantitySelector isDisabled={removeLineLoading} />
        </CartLineContent>
      </div>
    </CartLineWrapper>
  )
}
