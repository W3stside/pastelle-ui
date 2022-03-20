import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import Loader from 'components/Loader'
import { Row } from 'components/Layout'

import useDetectScrollIntoView from 'hooks/useDetectScrollIntoView'

import { ItemHeader } from 'pages/SingleItem/styleds'

import { ThemeModes } from 'theme/styled'
import { getThemeColours } from 'theme/utils'
import { BoxProps } from 'rebass'

type WithContainer = {
  container: HTMLElement | null | undefined
}

type LazyVideoProps = {
  sourcesProps: React.DetailedHTMLProps<React.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>[]
  videoProps?: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
  loadInView?: boolean
} & WithContainer &
  BoxProps

const VideoContainer = styled(Row)`
  position: relative;

  > ${ItemHeader} {
    position: absolute;
    right: 15%;
    letter-spacing: -8px;
    font-size: 76px;
  }

  > svg {
    position: absolute;
    right: 30%;
    z-index: 200;
  }

  > video {
    max-width: 100%;
  }
`

const BASE_VIDEO_PROPS = { loop: true, muted: true, autoPlay: true, preload: 'none' }
const BASE_INTERSECTION_OPTIONS = {
  threshold: 0.1
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

  const isInView = useDetectScrollIntoView(loadInView ? videoElement : undefined, {
    ...BASE_INTERSECTION_OPTIONS,
    root: container
  })

  return (
    <VideoContainer justifyContent="center" {...boxProps}>
      {!loaded && (
        <>
          <ItemHeader itemColor={getThemeColours(ThemeModes.CHAMELEON).blue1} animation>
            pstl
          </ItemHeader>
          <Loader size={'100px'} />
        </>
      )}
      <video {...BASE_VIDEO_PROPS} {...videoProps} ref={setVideoElement}>
        {isInView
          ? sourcesProps.map(({ src, ...sourceProps }, index) => <source key={index} src={src} {...sourceProps} />)
          : null}
      </video>
    </VideoContainer>
  )
})
