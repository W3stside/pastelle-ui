import { Redirect } from 'react-router-dom'
import styled from 'styled-components/macro'
import { AsideWithVideo } from 'pages/SingleItem'

import { useState, useRef, useEffect, MutableRefObject } from 'react'
import { useCatalogItemFromURL } from './hooks'

import MOCK_CATALOG_MAP from 'mock/apparel'

export const CatalogContainer = styled.article``

export default function Catalog() {
  // Logic to check if we're currently viewing this item
  const [, setIsViewingItem] = useState(false)
  const itemRef = useRef<HTMLDivElement | undefined>(undefined)
  const pageArticleRef = useRef<HTMLDivElement | null>(null)

  console.log('itemRef', itemRef.current)
  useEffect(() => {
    if (!itemRef.current) return
    const itemPage = itemRef.current

    function handleOnScrollDetect(event: Event) {
      console.warn('ITEM PAGE SCROLL EVENT', event)
      setIsViewingItem(true)
    }

    itemPage.onscroll = handleOnScrollDetect

    return () => {
      itemPage.removeEventListener('onscroll', handleOnScrollDetect)
      setIsViewingItem(false)
    }
  })

  // get catalog item from data and url
  const itemData = useCatalogItemFromURL(MOCK_CATALOG_MAP)

  if (!itemData) return <Redirect to="/404" />

  return (
    <CatalogContainer ref={pageArticleRef}>
      <AsideWithVideo ref={(itemRef as unknown) as MutableRefObject<HTMLDivElement | null>} {...itemData} />
    </CatalogContainer>
  )
}
