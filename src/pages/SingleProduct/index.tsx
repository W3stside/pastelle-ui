import { useStateRef } from '@past3lle/hooks'
import { devDebug } from '@past3lle/utils'
import SEO from 'components/SEO'
import { useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { DEFAULT_CURRENT_COLLECTION_VARIABLES, useQueryProductById } from 'shopify/graphql/hooks'
import { getShopifyId } from 'shopify/utils'
import { useCurrentCollection, useUpdateCurrentlyViewingProduct } from 'state/collection/hooks'

import AsideWithVideo from './AsideWithVideo'
import { SingleProductArticle } from './styled'

export default function SingleItem() {
  const [container, setContainerRef] = useStateRef<HTMLElement | null>(null, (node) => node)
  const parentAspectRatio = getNodeAspectRatio(container)

  const [searchParams] = useSearchParams()
  const queryProductById = useQueryProductById({
    id: getShopifyId(searchParams.get('skillId'), 'Product'),
    imageAmt: DEFAULT_CURRENT_COLLECTION_VARIABLES.imageAmt,
    videoAmt: DEFAULT_CURRENT_COLLECTION_VARIABLES.videoAmt,
  })

  // Internal referrer = shopify handle
  // External referrer = shopfiy ID
  const { handle } = useParams()
  const { collection } = useCurrentCollection()
  const product = useMemo(() => (handle ? collection?.[handle] : null), [collection, handle])

  // update state store with current browsing SINGLE product
  useUpdateCurrentlyViewingProduct(true, product)

  const navigate = useNavigate()
  useEffect(() => {
    // redirect if no product
    if (!product) {
      devDebug('No product, redirecting')
      navigate('/404')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  if (!product) return null

  return (
    <>
      <SEO
        title={product.handle.toUpperCase()}
        name={product.handle.toUpperCase()}
        description={`${product.handle.toUpperCase()}: ${product.shortDescription || 'STREET.APPAREL'}`}
      />

      <SingleProductArticle id="COLLECTION-ARTICLE" display="flex" ref={setContainerRef}>
        <AsideWithVideo {...product} parentAspectRatio={parentAspectRatio} />
      </SingleProductArticle>
    </>
  )
}
function getNodeAspectRatio(node: HTMLElement | undefined | null) {
  if (!node) return undefined
  return node.clientWidth / node.clientHeight
}
