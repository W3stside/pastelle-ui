import { ShoppingCartPanel } from '@/components/ShoppingCart'
import { useGetCartState, useToggleCartAndState } from '@/state/cart/hooks'

// Standalone shopping cart panel
export default function ShoppingCart() {
  const cart = useGetCartState()
  const [, openOrCloseCart] = useToggleCartAndState()

  if (!cart?.cartId) return null
  return <ShoppingCartPanel cartId={cart.cartId} closeCartPanel={() => openOrCloseCart(false, cart)} />
}
