import styled from 'styled-components/macro'
import { AsideWithVideo } from 'pages/SingleItem'
import HOME_ITEMS_LIST from 'mock/apparel'
import { useState, useRef, useEffect, MutableRefObject } from 'react'

export const PageArticle = styled.article``

export default function Home() {
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
  return (
    <PageArticle ref={pageArticleRef}>
      {HOME_ITEMS_LIST.map(({ key, ...restItemData }) => (
        <AsideWithVideo
          key={key}
          ref={(itemRef as unknown) as MutableRefObject<HTMLDivElement | null>}
          {...restItemData}
        />
      ))}
    </PageArticle>
  )
}
