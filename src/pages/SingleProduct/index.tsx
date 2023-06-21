import { useStateRef } from '@past3lle/hooks'
import { devDebug } from '@past3lle/utils'
import SEO from 'components/SEO'
import { BaseProductPageProps } from 'pages/common/types'
import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCollection, useUpdateCurrentlyViewingProduct } from 'state/collection/hooks'

import AsideWithVideo from './AsideWithVideo'
import { SingleProductArticle } from './styled'

export default function SingleItem() {
  const [container, setContainerRef] = useStateRef<HTMLElement | null>(null, (node) => node)
  const parentAspectRatio = getNodeAspectRatio(container)

  // Internal referrer = shopify handle
  // External referrer = shopfiy ID
  const { handle } = useParams()
  const { current, collections } = useCollection()
  const product = useMemo(() => {
    let product: BaseProductPageProps | undefined
    if (handle) {
      const productInCurrentCollection = current?.id && collections?.[current.id]?.products?.[handle]
      if (productInCurrentCollection) {
        product = productInCurrentCollection
      } else {
        const flattenedCollections = Object.values(collections).flatMap((collection) => [
          ...Object.values(collection.products),
        ])
        return flattenedCollections.find((product) => handle === product.handle)
      }
    }

    return product
  }, [current?.id, collections, handle])

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

/* 
const [searchParams] = useSearchParams()
  // TODO: use this properly
  useQueryProductById({
    id: getShopifyId(searchParams.get('skillId'), 'Product'),
    imageAmt: DEFAULT_CURRENT_COLLECTION_VARIABLES.imageAmt,
    videoAmt: DEFAULT_CURRENT_COLLECTION_VARIABLES.videoAmt,
  })
*/
