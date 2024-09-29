import { useStateRef, useWindowSize } from '@past3lle/hooks'
import {
  SingleProductArticle,
  SingleProductAsidePanel,
  SingleProductContainer,
  SingleProductScreensContainer,
} from '@/components/Asides/skill/styled'
import { MutableRefObject, ReactNode, useMemo, useRef } from 'react'
import { getNodeAspectRatio } from '@/utils/formatting'

import { CommonSinglePageProps } from './types'
import { Literal } from 'unist'

export type SmartWrapperNodesAndRefs = {
  asideContainerRef: MutableRefObject<HTMLElement | undefined>
  parentAspectRatio: number | undefined
  setScreensContainerRef: (newNode: Literal) => void
  rootContainerNode: HTMLElement | null
  screensContainerNode: HTMLElement | null
}
export type SmartWrapperFunctionChildren = {
  children?: ({
    asideContainerRef,
    parentAspectRatio,
    rootContainerNode,
    screensContainerNode,
    setScreensContainerRef,
  }: SmartWrapperNodesAndRefs) => ReactNode
}

export function SingleAsidePage({ children, ...restProps }: CommonSinglePageProps & SmartWrapperFunctionChildren) {
  return (
    <SinglePageSmartWrapper {...restProps}>
      {(props) => (
        <>
          <SingleProductContainer id="#item-container" parentAspectRatio={props.parentAspectRatio}>
            <SingleProductAsidePanel id="#item-aside-panel" ref={props.asideContainerRef}>
              <SingleProductScreensContainer
                $calculatedSizes={{
                  height: props.asideContainerRef.current?.clientHeight,
                  width: props.screensContainerNode?.clientWidth,
                }}
                ref={props.setScreensContainerRef}
                bgColor={restProps?.bgColor}
                navLogo={restProps?.altLogo}
                logo={restProps?.logo}
              >
                {children?.(props)}
              </SingleProductScreensContainer>
            </SingleProductAsidePanel>
            {/* We need ShowcaseVideos here */}
          </SingleProductContainer>
        </>
      )}
    </SinglePageSmartWrapper>
  )
}

export function SinglePageSmartWrapper({ children }: SmartWrapperFunctionChildren) {
  const [rootContainerNode, setContainerRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)
  const size = useWindowSize()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const parentAspectRatio = useMemo(() => getNodeAspectRatio(rootContainerNode), [rootContainerNode, size?.ar])

  const asideContainerRef = useRef<HTMLElement>()
  const [screensContainerNode, setScreensContainerRef] = useStateRef<HTMLElement | null>(null, (node) => node)

  const memoisedProps = useMemo(
    () => ({
      asideContainerRef,
      parentAspectRatio,
      rootContainerNode,
      screensContainerNode,
      setScreensContainerRef,
    }),
    [parentAspectRatio, rootContainerNode, screensContainerNode, setScreensContainerRef],
  )

  return (
    <SingleProductArticle id="COLLECTION-ARTICLE" display="flex" ref={setContainerRef}>
      {children?.(memoisedProps)}
    </SingleProductArticle>
  )
}
