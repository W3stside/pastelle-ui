import { useCallback, useEffect, useMemo, useState } from 'react'
import { ShoppingCart as ShoppingCartIcon, X } from 'react-feather'

import { Column, Row } from 'components/Layout'
import LoadingRows from 'components/Loader/LoadingRows'
import SmartImg from 'components/SmartImg'
import { ItemHeader, ItemSubHeader } from 'pages/SingleItem/styleds'
import { useQueryCart } from 'shopify/graphql/hooks'
import {
  FragmentCartCostFragment,
  FragmentCartLineFragment,
  GetCartQuery,
  ProductBrandingAssets
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
  ShoppingCartFullWrapper
} from './styled'
import useQuantitySelector from 'hooks/useQuantitySelector'
import { getMetafields, sizeToFullSize } from 'shopify/utils'
import { DEFAULT_CART_LINES_AMOUNT } from 'constants/config'
import usePrevious from 'hooks/usePrevious'
import useCleanTimeout from 'hooks/useCleanTimeout'
import { useHistory } from 'react-router-dom'
import { buildItemUrl, checkIsCatalogPage } from 'utils/navigation'
import { useOnScreenProductHandle } from 'state/user/hooks'
import { formatCurrency } from 'utils/formatting'
import { WHITE } from 'theme/utils'
import { CATALOG_PATHNAME } from 'constants/navigation'

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

  const history = useHistory()
  const isCatalogPage = checkIsCatalogPage(history.location)

  const handleNavClick = useCallback(() => {
    closeCartPanel()
    history.push(CATALOG_PATHNAME)
  }, [closeCartPanel, history])

  return (
    <ShoppingCartPanelWrapper>
      <ShoppingCartPanelContentWrapper>
        <CartTableHeader
          data={data}
          totalQuantity={totalQuantity}
          subTotal={subTotal}
          closeCartPanel={closeCartPanel}
        />
        {loading ? (
          <LoadingRows rows={3} $height={'14rem'} $padding="1rem" $margin="1rem 0" />
        ) : isEmptyCart ? (
          <ItemSubHeader color={WHITE} fontSize={'2.5rem'} fontWeight={400} padding={0} margin={'2rem 0'}>
            <span id="lenny-face">Your cart is</span> <strong>empty</strong> <span id="lenny-face">ʕ ͡° ʖ̯ ͡°ʔ</span>
            {!isCatalogPage && (
              <p onClick={handleNavClick}>
                <u>Check out the full catalog!</u>
              </p>
            )}
          </ItemSubHeader>
        ) : (
          cartLines?.map(line => <CartLine key={line.id} line={line} />)
        )}
      </ShoppingCartPanelContentWrapper>
    </ShoppingCartPanelWrapper>
  )
}

function CartTableHeader({
  data,
  totalQuantity,
  subTotal,
  closeCartPanel
}: {
  data: GetCartQuery | undefined
  totalQuantity: number | undefined
  subTotal: FragmentCartCostFragment['subtotalAmount'] | undefined
  closeCartPanel: () => void
}) {
  return (
    <CartTableHeaderWrapper>
      <ItemHeader margin={'1rem auto 0 0'} color={WHITE} itemColor={'transparent'} letterSpacing={-10}>
        CART
      </ItemHeader>
      {/* <Strikethrough /> */}
      {data?.cart && (
        <Column>
          {!!totalQuantity && (
            <ItemHeader color={WHITE} itemColor={'transparent'} fontSize={'3.5rem'} letterSpacing={0}>
              {totalQuantity} items
            </ItemHeader>
          )}
          {subTotal && (
            <ItemHeader color={WHITE} itemColor={'transparent'} fontSize={'3.5rem'} letterSpacing={0}>
              {formatCurrency(subTotal.amount, subTotal.currencyCode)}
            </ItemHeader>
          )}
        </Column>
      )}
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
      ? () => {
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

  const history = useHistory()
  const handleClick = useCallback(() => {
    const url = buildItemUrl({ identifier: handle })
    history.push(url)
  }, [history, handle])

  useEffect(() => {
    if (removeLineLoading || !line.id) return
    else if (selectionIsValidQuantity && wasPreviousAndChanged) {
      updateCartLineCallback({ quantity, lineId: line.id })
    }
  }, [line.id, quantity, selectionIsValidQuantity, updateCartLineCallback, removeLineLoading, wasPreviousAndChanged])

  const sizeFull = sizeToFullSize(line?.merchandise.size)
  const catalogCurrentProduct = useOnScreenProductHandle()

  return (
    <CartLineWrapper brandAssetMap={brandAssetMap} color={itemColor}>
      <div>
        {/* 1 */}
        {/* <SMART IMG SPAN />*/}
        {/* 2 */}
        <SmartImg defaultPath={images.nodes[0].url500} onClick={handleClick} />
        {/* 3 */}
        <CartLineContent onClick={handleClick}>
          <Row>
            <ItemSubHeader color={WHITE} fontSize={'3rem'} fontWeight={1000} padding={0} margin={0}>
              {line?.merchandise.product.title}
            </ItemSubHeader>
            <ItemSubHeader color={WHITE} fontSize={'1.5rem'} fontWeight={300} padding={0} margin={0}>
              {sizeFull} {sizeFull && `(${line?.merchandise.size})`}
            </ItemSubHeader>
            {catalogCurrentProduct?.handle !== handle && (
              <ItemSubHeader color={WHITE} fontSize={'1.5rem'} fontWeight={300} padding={0} margin={0}>
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
