import { Redirect } from 'react-router-dom'
import styled from 'styled-components/macro'
import { AsideWithVideo } from 'pages/SingleItem'

import { useState, useRef, useEffect } from 'react'
import { useCatalogItemFromURL, useMockGetCatalogData } from './hooks'

import { fadeInAnimation } from 'pages/SingleItem/styleds'

import { useWheel } from '@use-gesture/react'
import { Lethargy } from 'lethargy'
import clamp from 'lodash.clamp'

export const CatalogContainer = styled.article`
  overflow: hidden;
  filter: contrast(1) blur(0px);

  ${fadeInAnimation};

  animation-name: fadeIn;
  animation-duration: 0.8s;
`

const lethargy = new Lethargy()

const Scroller = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  width: calc(100% - 500px);
  z-index: 900;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `}
`

export default function Catalog() {
  const [index, setIndex] = useState(0)

  // ref to entire Catalog container
  const catalogRef = useRef<HTMLDivElement | null>(null)
  const [ref, setRef] = useState<HTMLDivElement | undefined>()

  useEffect(() => {
    console.debug('CATALOG REF', catalogRef?.current)
    setRef(catalogRef?.current ?? undefined)
  }, [])

  // get push control
  // const { push } = useHistory()

  // mock hook for async fetching of catalog data
  const { data: mockCatalogData } = useMockGetCatalogData({ year: 2022, season: 'FALL' })
  // get catalog item from data and url
  const { seasonList, currentItem } = useCatalogItemFromURL(mockCatalogData)
  // const catalogLastIndex = seasonList.length - 1

  const bind = useWheel(({ event, last, memo: wait = false }) => {
    if (!last) {
      const s = lethargy.check(event)
      if (s) {
        if (!wait) {
          setIndex(i => clamp(i - s, 0, seasonList.length - 1))
          return true
        }
        // TODO: check
        return false
      } else {
        return false
      }
    } else {
      return false
    }
  })

  /* useScrollDirection<HTMLDivElement>({
    ref: pageArticleRef,
    scrollUpCb: () => {
      console.debug('SCROLL STATS::DIRECTION > UP')
      push('/catalog/2022/FALL/' + seasonList[itemIndex === catalogLastIndex ? 0 : itemIndex + 1])
      window.scrollTo(0, 3)
    },
    scrollDownCb: () => {
      console.debug('SCROLL STATS::DIRECTION > DOWN')
      push('/catalog/2022/FALL/' + seasonList[itemIndex === 0 ? catalogLastIndex : itemIndex - 1])
      window.scrollTo(0, 3)
    }
  }) */

  if (!currentItem) return <Redirect to="/404" />

  return (
    <CatalogContainer ref={catalogRef}>
      {ref && (
        <div
          style={{
            height: '100%',
            transform: `translateY(${-index * ref.clientHeight}px)`,
            transition: 'transform 350ms ease-in-out'
          }}
        >
          {/* scroll div */}
          <Scroller style={{ transform: `translateY(${index * ref.clientHeight}px)` }} {...bind()} />
          {seasonList.map(({ key, ...seasonItem }) => (
            <AsideWithVideo key={key} {...seasonItem} />
          ))}
        </div>
      )}
    </CatalogContainer>
  )
}
