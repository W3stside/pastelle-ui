import { ShoppingCart as ShoppingCartIcon, X } from 'react-feather'

import { Row } from 'components/Layout'
import LoadingRows from 'components/Loader/LoadingRows'
import SmartImg from 'components/SmartImg'
import { ItemHeader, ItemSubHeader } from 'pages/SingleItem/styleds'
import { useQueryCart } from 'shopify/graphql/hooks'
import { FragmentCartLineFragment } from 'shopify/graphql/types'
import { useGetCartDispatch, useGetCartIdDispatch } from 'state/cart/hooks'
import { CartState } from 'state/cart/reducer'
import { useState } from 'react'
import {
  CartLineWrapper,
  ShoppingCartPanelContentWrapper,
  ShoppingCartPanelWrapper,
  ShoppingCartQuantityWrapper,
  ShoppingCartWrapper
} from './styled'
import useQuantitySelector from 'hooks/useQuantitySelector'

function ShoppingCartQuantity({ totalQuantity }: Pick<CartState, 'totalQuantity'>) {
  return <ShoppingCartQuantityWrapper>{totalQuantity}</ShoppingCartQuantityWrapper>
}

// Icon and count to show in header
export function ShoppingCartHeader() {
  const [shoppingPanelOpen, setShoppingPanelOpen] = useState(false)
  const cart = useGetCartDispatch()
  return (
    <>
      <ShoppingCartWrapper onClick={() => setShoppingPanelOpen(true)}>
        <ShoppingCartIcon size={'3rem'} />
        <ShoppingCartQuantity totalQuantity={cart.totalQuantity} />
      </ShoppingCartWrapper>
      {shoppingPanelOpen && <ShoppingCart closeCartPanel={() => setShoppingPanelOpen(false)} />}
    </>
  )
}

// Standalone shopping cart panel
export function ShoppingCart({ closeCartPanel }: { closeCartPanel: () => void }) {
  const cartId = useGetCartIdDispatch()
  if (!cartId) return null
  return <ShoppingCartPanel cartId={cartId} closeCartPanel={closeCartPanel} />
}

const LINES_AMOUNT = 20
function ShoppingCartPanel({ cartId, closeCartPanel }: { cartId: string; closeCartPanel: () => void }) {
  const { data, loading } = useQueryCart({ cartId, linesAmount: LINES_AMOUNT })
  const cartLines = data?.cart?.lines.nodes
  return (
    <ShoppingCartPanelWrapper>
      <ShoppingCartPanelContentWrapper>
        <Row>
          <ItemHeader margin={'1rem auto 0 0'} color={'black'} itemColor={'red'}>
            CART
          </ItemHeader>
          <X size={'5rem'} color={'black'} onClick={closeCartPanel} />
        </Row>
        {loading ? <LoadingRows rows={LINES_AMOUNT} /> : cartLines?.map(line => <CartLine key={line.id} line={line} />)}
      </ShoppingCartPanelContentWrapper>
    </ShoppingCartPanelWrapper>
  )
}

function CartLine({ line }: { line: FragmentCartLineFragment }) {
  const { QuantitySelector } = useQuantitySelector({ defaultQuantity: line.quantity })
  return (
    <CartLineWrapper>
      {/* <SMART IMG SPAN />*/}
      <ItemSubHeader>{line?.quantity}</ItemSubHeader>
      <SmartImg defaultPath={line.merchandise.product.images.nodes[0].url} />
      <ItemSubHeader>{line?.merchandise.product.title}</ItemSubHeader>
      <ItemSubHeader>{line?.merchandise.size}</ItemSubHeader>
      <QuantitySelector />
    </CartLineWrapper>
  )
}
