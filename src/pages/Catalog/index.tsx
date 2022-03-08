import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components/macro'
import { useWheel } from '@use-gesture/react'
import { Lethargy } from 'lethargy'
import clamp from 'lodash.clamp'

import { AsideWithVideo } from 'pages/SingleItem'

import { useCatalogItemFromURL } from './hooks'

import { fadeInAnimation } from 'pages/SingleItem/styleds'
import { useCatalog } from 'state/catalog/hooks'

export const CatalogContainer = styled.article`
  overflow: hidden;
  filter: contrast(1) blur(0px);

  ${fadeInAnimation};

  animation-name: fadeIn;
  animation-duration: 0.8s;
`

const lethargy = new Lethargy()

const Scroller = styled.div<{ index: number; clientHeight: number }>`
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  width: calc(100% - 500px);
  z-index: 900;

  transform: ${({ index, clientHeight }) => `translateY(${index * clientHeight}px)`};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `}
`

const ScrollerContainer = styled.div<{ index: number; clientHeight: number }>`
  height: 100%;

  transform: ${({ index, clientHeight }) => `translateY(${-index * clientHeight}px)`};
  transition: transform 350ms ease-in-out;
`
export const BASE_CATALOG_URL = '/catalog/2022/FALL/'
export default function Catalog() {
  const [index, setIndex] = useState(0)

  // ref to entire Catalog container
  const catalogRef = useRef<HTMLDivElement | null>(null)
  const [ref, setRef] = useState<HTMLDivElement | undefined>()
  // set container ref to state
  useEffect(() => {
    setRef(catalogRef?.current ?? undefined)
  }, [])

  // get replace control
  // const { replace } = useHistory()
  // const locationApi = useLocation()

  // mock hook for async fetching of catalog data
  const fullCatalog = useCatalog()
  // get catalog item from data and url
  const { seasonList, currentItem } = useCatalogItemFromURL(fullCatalog)

  // set URL to reflect current item
  /* useEffect(() => {
    const currentItemKey = seasonList[index]?.key
    if (!currentItemKey) return

    replace(BASE_CATALOG_URL + currentItemKey.split('-')[0])
  }, [index, replace, seasonList]) */

  const bind = useWheel(
    ({ event, last, memo: wait = false }) => {
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
    },
    {
      rubberband: 0.3
    }
  )

  // if (!currentItem) return <Redirect to="/404" />
  if (!currentItem) return null

  return (
    <CatalogContainer ref={catalogRef}>
      {ref && (
        <ScrollerContainer index={index} clientHeight={ref.clientHeight}>
          {/* scroll div */}
          <Scroller index={index} clientHeight={ref.clientHeight} {...bind()} />
          {seasonList.map(({ key, ...seasonItem }, mapIndex) => (
            <AsideWithVideo itemIndex={index} isActive={index === mapIndex} key={key} {...seasonItem} />
          ))}
        </ScrollerContainer>
      )}
    </CatalogContainer>
  )
}
