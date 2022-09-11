import { useEffect } from 'react'
import { useCreateCart, useQueryCart } from 'shopify/graphql/hooks'
import { useCreateCartDispatch, useGetCartIdDispatch } from 'state/cart/hooks'
import { CreateCartParams } from './reducer'

export default function CartUpdater() {
  const cartId = useGetCartIdDispatch()
  const [createCart] = useCreateCart()

  const setCartInfo = useCreateCartDispatch()

  return cartId ? (
    <PreviousCartSubUpdater cartId={cartId} setCartInfo={setCartInfo} />
  ) : (
    <NewCartSubUpdater setCartInfo={setCartInfo} createCart={createCart} />
  )
}

function NewCartSubUpdater({
  createCart,
  setCartInfo
}: {
  setCartInfo: (params: CreateCartParams) => void
  createCart: (...params: any[]) => Promise<any>
}) {
  useEffect(() => {
    console.debug('[CART UPDATER::NEW CART SUB-UPDATER] --> New cart found! Setting.')
    createCart()
      .then(({ data: cartResponse }) => {
        const cart = cartResponse?.cartCreate?.cart

        cart && setCartInfo(cart.id)
      })
      .catch(error => {
        console.error('Cart initialisation error!', error)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

function PreviousCartSubUpdater({
  cartId,
  setCartInfo
}: {
  cartId: string
  setCartInfo: (params: CreateCartParams) => void
}) {
  const { data: previousCart } = useQueryCart({ cartId, linesAmount: 10 })

  useEffect(() => {
    console.debug('[CART UPDATER::PREVIOUS CART SUB-UPDATER] --> Previous cart found! Setting.')
    previousCart?.cart && setCartInfo(previousCart.cart.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
