import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { Row } from 'components/Layout'

import useDetectScrollIntoView from 'hooks/useDetectScrollIntoView'

import { ItemHeader, ItemSubHeader, VideoPlayCTAOverlay } from 'pages/common/styleds'

import { BoxProps } from 'rebass'
import { getThemeColours, OFF_WHITE } from 'theme/utils'
import { Play } from 'react-feather'
import { getMobileShowcaseVideoWidth } from 'pages/common/utils'
import { useCurrentProductMedia } from 'state/collection/hooks'

import PastelleCirclePinkYellow from 'assets/svg/pastelle-circle-pink-yellow.svg'
import { ThemeModes } from 'theme/styled'

type WithContainer = {
  container: HTMLElement | null | undefined
}

type AutoPlayOptions = {
  stopTime: number
}

export type LazyVideoProps = {
  sourcesProps: React.DetailedHTMLProps<React.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>[]
  videoProps?: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
  loadInView?: boolean
  forceLoad?: boolean
  showTapToPlay?: boolean
  showError?: boolean
  videoDelay?: boolean
  autoPlayOptions?: AutoPlayOptions
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
`

const BASE_VIDEO_PROPS: Partial<React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>> = {
  loop: true,
  muted: true,
  autoPlay: true,
  preload: 'none',
  playsInline: true
}
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
    forceLoad = false,
    showTapToPlay = false,
    videoDelay = false,
    showError = false,
    container,
    ...boxProps
  }: LazyVideoProps,
  forwardRef: ForwardedRef<HTMLVideoElement>
) {
  const [sourceErrored, setSourceErrored] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [metadataLoaded, setMetaDataLoaded] = useState(false)
  const loading = !metadataLoaded || !dataLoaded

  const [lastSourceElem, setLastSourceElem] = useState<HTMLSourceElement | null>(null)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  // forwardedRef in use, we need to assign our internal ref to the external
  useEffect(() => {
    if (forwardRef && videoElement) {
      typeof forwardRef === 'function' && forwardRef(videoElement)
    }
  }, [forwardRef, videoElement])

  // capture LAST source error state
  useEffect(() => {
    const _handleSourceErrored = () => setSourceErrored(true)

    let source: HTMLSourceElement
    if (lastSourceElem) {
      source = lastSourceElem
      source.addEventListener('error', _handleSourceErrored)
    }

    return () => {
      source?.removeEventListener('error', _handleSourceErrored)
    }
  }, [lastSourceElem])

  // set VIDEO loading states for forwardRef
  useEffect(() => {
    const _handleDataLoad = () => {
      video?.removeEventListener('loadeddata', _handleDataLoad)
      setDataLoaded(true)
    }
    const _handleMetaDataLoad = () => {
      video?.removeEventListener('loadedmetadata', _handleMetaDataLoad)
      setMetaDataLoaded(true)
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoElement])

  const isInView = useDetectScrollIntoView(
    loadInView ? videoElement : undefined,
    {
      ...BASE_INTERSECTION_OPTIONS,
      root: container
    },
    !loadInView
  )
  const combinedVideoProps = { ...BASE_VIDEO_PROPS, ...videoProps }
  const showDelayer = !showTapToPlay && (videoDelay || loading)
  return (
    <VideoContainer justifyContent="center" {...boxProps}>
      {/* 
      // TODO: reenable if in future loader/delayer should be different
      {loading ? <LoadingComponent /> : videoDelay ? <VideoDelayer /> : null} 
      */}
      {/* Show delayer comp whether delayed or is loading */}
      {showError || sourceErrored ? <VideoErrorOverlay /> : showDelayer ? <VideoDelayer /> : null}
      {showTapToPlay && (
        <VideoPlayCTAOverlay
          $width={getMobileShowcaseVideoWidth(videoElement)}
          left={-20}
          $height="100%"
          textAlign="center"
        >
          <ItemSubHeader color={OFF_WHITE} display="flex" alignItems="center" justifyContent="center">
            <Play size="1.8rem" style={{ marginRight: '0.5rem' }} /> TAP TO PLAY
          </ItemSubHeader>
        </VideoPlayCTAOverlay>
      )}
      <video {...combinedVideoProps} ref={setVideoElement}>
        {isInView || forceLoad
          ? sourcesProps.map(({ src, ...sourceProps }, index, arr) => {
              const isLast = index === arr.length - 1
              return <source key={src} src={src} ref={isLast ? setLastSourceElem : null} {...sourceProps} />
            })
          : null}
      </video>
    </VideoContainer>
  )
})

export function VideoDelayer() {
  const { color } = useCurrentProductMedia()

  return (
    <VideoPlayCTAOverlay bgColor={color} $height="100%" $width="120%">
      <img src={PastelleCirclePinkYellow} />
    </VideoPlayCTAOverlay>
  )
}

function VideoErrorOverlay() {
  return (
    <VideoPlayCTAOverlay bgColor={getThemeColours(ThemeModes.DARK).red3} $height="100%" $width="120%">
      <ItemHeader
        itemColor={OFF_WHITE}
        animation={false}
        letterSpacing={0}
        fontSize={20}
        padding="10rem"
        margin="0 15% 0 auto"
      >
        <p>
          NO SHOWCASE AVAILABLE!{' '}
          <span style={{ fontStyle: 'normal', fontWeight: 200, whiteSpace: 'pre' }}>ʕ ͡° ʖ̯ ͡°ʔ</span>
        </p>
        <div>TRY SELECTING A DIFFERENT SIZE</div>
      </ItemHeader>
    </VideoPlayCTAOverlay>
  )
}
