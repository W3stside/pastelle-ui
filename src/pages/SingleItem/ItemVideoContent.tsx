import { useCallback, useEffect, useMemo, useState } from 'react'

import { ItemSubHeader, VideoContentWrapper, VideoControlButton as VideoControlButtonStyled } from './styleds'
import LazyVideo, { LazyVideoProps } from 'components/LazyVideo'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'
import { ButtonVariations } from 'components/Button'
import { Play, Pause } from 'react-feather'
import { RowProps } from 'components/Layout'
import { wait } from 'utils/async'

type VideoStatus = 'PLAYING' | 'PAUSED' | 'LOADED_AND_WAITING' | undefined
export interface ItemVideoContentProps extends RowProps {
  videos: FragmentProductVideoFragment[]
  firstPaintOver?: boolean
  currentCarouselIndex: number | null
  forceLoad?: boolean
  showPoster?: boolean
  zIndex?: number
  isMobileWidth: boolean
  videoProps?: LazyVideoProps['videoProps']
  showError?: boolean
}
const CONTROL_BUTTON_SIZE = '1.6rem'
export const ItemVideoContent = ({
  videos,
  currentCarouselIndex,
  firstPaintOver,
  forceLoad,
  showPoster = true,
  videoProps,
  isMobileWidth,
  showError,
  ...styleProps
}: ItemVideoContentProps) => {
  const [videoIdx, setVideoIdx] = useState(currentCarouselIndex)
  const [videoStatus, setVideoStatus] = useState<VideoStatus>(undefined)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const [videoDelay, showVideoUIDelay] = useState<boolean>(false)

  useEffect(() => {
    async function videoChange() {
      // if is web
      if (!isMobileWidth && currentCarouselIndex !== null) {
        _delayedVideoUpdater({ currentCarouselIndex, showVideoUIDelay, setVideoIdx })
      } else {
        setVideoIdx(currentCarouselIndex)
        setVideoStatus(undefined)
      }
    }
    currentCarouselIndex !== null && videoChange()
  }, [currentCarouselIndex, isMobileWidth])

  useEffect(() => {
    if (!videoElement) return
    else if (!videoStatus) {
      setVideoStatus('LOADED_AND_WAITING')
    }

    function handleOnPlaying() {
      setVideoStatus('PLAYING')
    }

    function handleOnPaused() {
      setVideoStatus('PAUSED')
    }

    videoElement.addEventListener('playing', handleOnPlaying)
    videoElement.addEventListener('pause', handleOnPaused)

    return () => {
      videoElement.removeEventListener('playing', handleOnPlaying)
      videoElement.removeEventListener('pause', handleOnPaused)
    }
  }, [videoElement, videoStatus])

  const isPlaying = videoStatus === 'PLAYING'

  const toggleVideo = useCallback(() => {
    if (!videoElement) return

    if (isPlaying) {
      videoElement.pause()
    } else {
      videoElement.play()
    }
  }, [isPlaying, videoElement])

  const videosContent = useMemo(
    () =>
      videos.map(({ id, sources, previewImage }, index) => {
        const isSelected = currentCarouselIndex === null || index === videoIdx
        if (!isSelected) return null

        return (
          <LazyVideo
            key={id}
            showError={showError}
            onClick={toggleVideo}
            ref={setVideoElement}
            container={document.querySelector('#COLLECTION-ARTICLE') as HTMLElement}
            loadInView={firstPaintOver}
            forceLoad={forceLoad}
            videoProps={{ ...videoProps, poster: showPoster ? previewImage?.url : undefined }}
            sourcesProps={sources.map(({ url, mimeType }) => ({ src: url, type: mimeType }))}
            height={styleProps.height}
            width={styleProps.width}
            videoDelay={!isMobileWidth && videoDelay}
            showTapToPlay={!isPlaying && videoProps?.autoPlay === false}
          />
        )
      }),
    [
      currentCarouselIndex,
      showError,
      firstPaintOver,
      forceLoad,
      isMobileWidth,
      isPlaying,
      showPoster,
      styleProps.height,
      styleProps.width,
      toggleVideo,
      videoDelay,
      videoIdx,
      videoProps,
      videos
    ]
  )

  return (
    <>
      <VideoContentWrapper id="#video-content-wrapper" {...styleProps}>
        {videosContent}
      </VideoContentWrapper>
      {/* PLAY/PAUSE */}
      {videoStatus && <VideoControlButton callback={toggleVideo} isPlaying={isPlaying} />}
    </>
  )
}

type VideoControlButtonParams = {
  callback: () => void
  isPlaying: boolean
}
function VideoControlButton({ callback, isPlaying }: VideoControlButtonParams) {
  return (
    <VideoControlButtonStyled variant={ButtonVariations.SECONDARY} onClick={callback}>
      <ItemSubHeader>
        {isPlaying ? (
          <>
            <Pause color="ghostwhite" fill="ghostwhite" size={CONTROL_BUTTON_SIZE} /> PAUSE
          </>
        ) : (
          <>
            <Play color="ghostwhite" fill="ghostwhite" size={CONTROL_BUTTON_SIZE} /> PLAY{' '}
          </>
        )}
      </ItemSubHeader>
    </VideoControlButtonStyled>
  )
}

type Props = ItemVideoContentProps & { isOpen: boolean; zIndex?: number }
export function SmallScreenVideoContent(props: Props) {
  const { isOpen, firstPaintOver, videos, currentCarouselIndex, ...styleProps } = props

  if (!isOpen) return null

  return (
    <ItemVideoContent
      firstPaintOver={firstPaintOver}
      videos={videos}
      currentCarouselIndex={currentCarouselIndex}
      forceLoad
      {...styleProps}
    />
  )
}

async function _delayedVideoUpdater({
  currentCarouselIndex,
  showVideoUIDelay,
  setVideoIdx
}: {
  currentCarouselIndex: number
  showVideoUIDelay: (state: boolean) => void
  setVideoIdx: (idx: number) => void
}) {
  showVideoUIDelay(true)
  await wait(500)
  setVideoIdx(currentCarouselIndex)
  await wait(500)
  showVideoUIDelay(false)
}
