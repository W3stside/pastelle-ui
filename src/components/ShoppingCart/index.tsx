import { useCallback, useEffect, useMemo, useState } from 'react'
import { ShoppingCart as ShoppingCartIcon, X } from 'react-feather'

import { Column, Row } from 'components/Layout'
import LoadingRows from 'components/Loader/LoadingRows'
import SmartImg from 'components/SmartImg'
import { ItemSubHeader } from 'pages/SingleItem/styleds'
import { useQueryCart } from 'shopify/graphql/hooks'
import {
  FragmentCartCostFragment,
  FragmentCartLineFragment,
  GetCartQuery,
  ProductBrandingAssets,
  ProductSizes
} from 'shopify/graphql/types'
import {
  useGetCartDispatch,
  useGetCartIdDispatch,
  useRemoveCartLineAndUpdateReduxCallback,
  useUpdateCartLineAndUpdateReduxCallback
} from 'state/cart/hooks'
import { CartState } from 'state/cart/reducer'
import {
  CartLineContent,
  CartLineWrapper,
  CartTableHeaderWrapper,
  ShoppingCartPanelContentWrapper,
  ShoppingCartPanelWrapper,
  ShoppingCartQuantityWrapper,
  ShoppingCartHeaderWrapper,
  ShoppingCartFullWrapper,
  CartHeader
} from './styled'
import useQuantitySelector from 'hooks/useQuantitySelector'
import { getMetafields, sizeToFullSize } from 'shopify/utils'
import { DEFAULT_CART_LINES_AMOUNT } from 'constants/config'
import usePrevious from 'hooks/usePrevious'
import useCleanTimeout from 'hooks/useCleanTimeout'
import { useLocation, useNavigate } from 'react-router-dom'
import { buildItemUrl, checkIsCollectionPage } from 'utils/navigation'
import { useOnScreenProductHandle } from 'state/collection/hooks'
import { formatCurrency } from 'utils/formatting'
import { getThemeColours, WHITE } from 'theme/utils'
import { COLLECTION_PATHNAME, COLLECTION_PARAM_NAME } from 'constants/navigation'
import Button, { ButtonVariations } from 'components/Button'

function ShoppingCartQuantity({ totalQuantity }: Pick<CartState, 'totalQuantity'>) {
  return <ShoppingCartQuantityWrapper>{totalQuantity}</ShoppingCartQuantityWrapper>
}

// Icon and count to show in header
export function ShoppingCartHeader() {
  const [shoppingPanelOpen, setShoppingPanelOpen] = useState(false)
  const cart = useGetCartDispatch()
  return (
    <ShoppingCartFullWrapper>
      <ShoppingCartHeaderWrapper onClick={() => setShoppingPanelOpen(true)}>
        <ShoppingCartIcon size={'3rem'} />
        <ShoppingCartQuantity totalQuantity={cart.totalQuantity} />
      </ShoppingCartHeaderWrapper>
      {shoppingPanelOpen && <ShoppingCart closeCartPanel={() => setShoppingPanelOpen(false)} />}
    </ShoppingCartFullWrapper>
  )
}

// Standalone shopping cart panel
export function ShoppingCart({ closeCartPanel }: { closeCartPanel: () => void }) {
  const cartId = useGetCartIdDispatch()
  if (!cartId) return null
  return <ShoppingCartPanel cartId={cartId} closeCartPanel={closeCartPanel} />
}

function ShoppingCartPanel({ cartId, closeCartPanel }: { cartId: string; closeCartPanel: () => void }) {
  const { data, loading } = useQueryCart({ cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT })
  const cartLines = data?.cart?.lines.nodes
  const totalQuantity = data?.cart?.totalQuantity
  const subTotal = data?.cart?.cost.subtotalAmount

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
          <ItemSubHeader color={WHITE} fontSize="2.5rem" fontWeight={400} padding={0} margin="2rem 0">
            <span id="lenny-face">Your cart is</span> <strong>empty</strong> <span id="lenny-face">ʕ ͡° ʖ̯ ͡°ʔ</span>
            {!isCollectionPage && (
              <p onClick={handleNavClick} style={{ cursor: 'pointer' }}>
                <u>Check out the full {COLLECTION_PARAM_NAME}</u>!
              </p>
            )}
          </ItemSubHeader>
        ) : (
          cartLines?.map(line => <CartLine key={line.id} line={line} />)
        )}
      </ShoppingCartPanelContentWrapper>

      {/* CHECKOUT */}
      {data?.cart?.checkoutUrl && data?.cart?.totalQuantity > 0 && (
        <CartTableHeaderWrapper gridTemplateColumns="max-content auto">
          {subTotal && (
            <CartHeader fontSize="3.5rem" letterSpacing={0}>
              {formatCurrency(subTotal.amount, subTotal.currencyCode)}
            </CartHeader>
          )}
          {/* TODO: remove disabled */}
          <Button
            padding="1rem"
            backgroundColor={getThemeColours().purple2}
            variant={ButtonVariations.SUCCESS}
            disabled
          >
            <CartHeader margin="0" letterSpacing={-2} fontSize="3rem">
              <a href={data.cart.checkoutUrl} target="_blank" rel="noopener noreferrer">
                CHECKOUT
              </a>
            </CartHeader>
          </Button>
        </CartTableHeaderWrapper>
      )}
    </ShoppingCartPanelWrapper>
  )
}

function CartTableHeader({
  totalQuantity,
  closeCartPanel
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
              }
            }
          )
        }
      : undefined
  })

  const previousQuantity = usePrevious(line.quantity)
  const wasPreviousAndChanged = !!previousQuantity && previousQuantity !== quantity
  const selectionIsValidQuantity = Number(quantity)

  const { color, brandingAssetMap, handle, images } = line.merchandise.product

  const { brandAssetMap, color: itemColor } = useMemo(
    () => ({
      brandAssetMap: {
        ...getMetafields<ProductBrandingAssets | undefined>(brandingAssetMap),
        get header() {
          return this?.logo || this?.header || this?.navBar
        }
      },
      color: getMetafields<string>(color)
    }),
    [brandingAssetMap, color]
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
    <CartLineWrapper brandAssetMap={brandAssetMap} color={itemColor}>
      <div>
        {/* 1 */}
        {/* <SMART IMG SPAN />*/}
        {/* 2 */}
        <SmartImg path={{ defaultPath: images.nodes[0].url125 }} onClick={handleClick} />
        {/* 3 */}
        <CartLineContent onClick={handleClick}>
          <Row>
            <ItemSubHeader color={WHITE} fontSize="3rem" fontWeight={1000} padding={0} margin={0}>
              {line?.merchandise.product.title}
            </ItemSubHeader>
            <ItemSubHeader color={WHITE} fontSize="1.5rem" fontWeight={300} padding={0} margin={0}>
              {sizeFull} {sizeFull && `(${line?.merchandise.size})`}
            </ItemSubHeader>
            {collectionCurrentProduct?.handle !== handle && (
              <ItemSubHeader color={WHITE} fontSize="1.5rem" fontWeight={300} padding={0} margin={0}>
                tap or click to view item
              </ItemSubHeader>
            )}
          </Row>
          <QuantitySelector isDisabled={removeLineLoading} />
        </CartLineContent>
      </div>
    </CartLineWrapper>
  )
}
