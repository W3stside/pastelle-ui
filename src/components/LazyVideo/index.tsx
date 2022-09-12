import { ForwardedRef, forwardRef, ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import Loader from 'components/Loader'
import { Row } from 'components/Layout'

import useDetectScrollIntoView from 'hooks/useDetectScrollIntoView'

import { ItemHeader } from 'pages/SingleItem/styleds'

import { BoxProps } from 'rebass'
import { Z_INDEXES } from 'constants/config'
import { BLUE } from 'theme/utils'

type WithContainer = {
  container: HTMLElement | null | undefined
}

type LazyVideoProps = {
  sourcesProps: React.DetailedHTMLProps<React.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>[]
  videoProps?: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
  loadInView?: boolean
  Loader?: (...props: any[]) => JSX.Element
} & WithContainer &
  BoxProps

const VideoContainer = styled(Row)`
  position: relative;

  > ${ItemHeader} {
    position: absolute;
    right: 15%;
    letter-spacing: -8px;
    font-size: 7.6rem;
  }

  > svg {
    position: absolute;
    right: 30%;
    z-index: ${Z_INDEXES.PRODUCT_VIDEOS};
  }
`

const Spinner = ({ label = 'pstl' }: { label?: ReactNode }) => (
  <>
    <ItemHeader itemColor={BLUE} animation>
      {label}
    </ItemHeader>
    <Loader size={'100px'} />
  </>
)

const BASE_VIDEO_PROPS = { loop: true, muted: true, autoPlay: true, preload: 'none' }
const BASE_INTERSECTION_OPTIONS = {
  threshold: 0.1,
  trackVisibility: true,
  delay: 300
}

export default forwardRef(function LazyVideo(
  {
    sourcesProps,
    videoProps = {},
    // useful for setting when setup is animated
    // e.g useSprings animating components
    // and we dont want to check if in view before animation ends
    loadInView = true,
    container,
    Loader = Spinner,
    ...boxProps
  }: LazyVideoProps,
  forwardRef: ForwardedRef<HTMLVideoElement>
) {
  const [dataLoaded, setDataLoaded] = useState(false)
  const [metaDataLoaded, setMetaDataLoaded] = useState(false)
  const loaded = metaDataLoaded && dataLoaded

  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  // forwardedRef in use, we need to assing our internal ref to the external
  useEffect(() => {
    if (forwardRef && videoElement) {
      typeof forwardRef === 'function' && forwardRef(videoElement)
    }
  }, [forwardRef, videoElement])

  useEffect(() => {
    const _handleDataLoad = () => setDataLoaded(true)
    const _handleMetaDataLoad = () => setMetaDataLoaded(true)

    let video: HTMLVideoElement
    if (videoElement) {
      video = videoElement

      video.addEventListener('loadeddata', _handleDataLoad)
      video.addEventListener('loadedmetadata', _handleMetaDataLoad)
    }

    return () => {
      video?.removeEventListener('loadeddata', _handleDataLoad)
      video?.removeEventListener('loadedmetadata', _handleMetaDataLoad)
    }
  }, [videoElement])

  const isInView = useDetectScrollIntoView(
    loadInView ? videoElement : undefined,
    {
      ...BASE_INTERSECTION_OPTIONS,
      root: container
    },
    !loadInView
  )

  return (
    <VideoContainer justifyContent="center" {...boxProps}>
      {!loaded && <Loader />}
      <video {...BASE_VIDEO_PROPS} {...videoProps} ref={setVideoElement}>
        {isInView
          ? sourcesProps.map(({ src, ...sourceProps }, index) => <source key={index} src={src} {...sourceProps} />)
          : null}
      </video>
    </VideoContainer>
  )
})
