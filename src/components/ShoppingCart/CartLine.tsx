import { Row, SmartImg } from '@past3lle/components'
import { useCleanTimeout, usePrevious } from '@past3lle/hooks'
import { WHITE } from '@past3lle/theme'
import { removeFromCartAnalytics } from '@/analytics/events/cartEvents'
import useQuantitySelector from 'hooks/useQuantitySelector'
import { ProductSubHeader } from '@/components/pages-common/styleds'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FragmentCartLineFragment, ProductSizes } from '@/shopify/graphql/types'
import { getMetafields, sizeToFullSize } from '@/shopify/utils'
import { useRemoveCartLineAndUpdateReduxCallback, useUpdateCartLineAndUpdateReduxCallback } from '@/state/cart/hooks'
import { useOnScreenProductHandle } from '@/state/collection/hooks'
import { buildItemUrl } from '@/utils/navigation'

import { QuantityBubble } from './common'
import { CartLineContent, CartLineWrapper } from './styled'
import { useRouter } from 'next/router'

export default function CartLine({ line }: { line: FragmentCartLineFragment }) {
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
          removeFromCartAnalytics(line.merchandise)
          removeCartLineCallback(
            { lineIds: [line.id] },
            {
              onCompleted: () => {
                cleanTimeout(() => setRemoveOperationLoading(false), 1000)
              },
            },
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
        (node) => node.altText === 'LOGO' || node.altText === 'HEADER' || node.altText === 'NAVBAR',
      )?.url500,
      color: getMetafields<string>(color),
    }),
    [color, images.nodes],
  )

  const { push: navigate } = useRouter()
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
      <div style={{ position: 'relative' }}>
        <QuantityBubble>{line?.quantity}</QuantityBubble>
        <SmartImg
          path={{ defaultPath: images.nodes[0].url125 }}
          onClick={handleClick}
          placeholderProps={{
            loadingContent: '...',
          }}
        />
        <CartLineContent onClick={handleClick}>
          <Row>
            <ProductSubHeader color={WHITE} fontSize="3rem" fontWeight={1000} padding={0} margin={0}>
              {line?.merchandise.product.title}
            </ProductSubHeader>
            <ProductSubHeader color={WHITE} fontSize="2.2rem" fontWeight={300} padding={0} margin={0}>
              {sizeFull?.toLocaleUpperCase()} {sizeFull && `(${line?.merchandise.size})`}
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
