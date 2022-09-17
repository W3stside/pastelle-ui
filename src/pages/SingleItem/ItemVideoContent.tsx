import { useCallback, useEffect, useState } from 'react'

import { ItemSubHeader, VideoContentWrapper, VideoControlButton as VideoControlButtonStyled } from './styleds'
import LazyVideo, { LazyVideoProps } from 'components/LazyVideo'
import { Spinner } from 'theme'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'
import { ButtonVariations } from 'components/Button'
import { Play, Pause } from 'react-feather'
import { RowProps } from 'components/Layout'
import { wait } from 'utils/async'

interface Params extends RowProps {
  videos: FragmentProductVideoFragment[]
  firstPaintOver?: boolean
  currentCarouselIndex: number
  forceLoad?: boolean
  showPoster?: boolean
  zIndex?: number
  isMobileWidth: boolean
  videoProps?: LazyVideoProps['videoProps']
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
  ...styleProps
}: Params) => {
  const [videoIdx, setVideoIdx] = useState(currentCarouselIndex)
  const [videoStatus, setVideoStatus] = useState<'PLAYING' | 'PAUSED' | 'LOADED_AND_WAITING' | undefined>(undefined)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const [videoDelay, showVideoUIDelay] = useState<boolean>(false)

  useEffect(() => {
    async function videoChange() {
      if (!isMobileWidth) {
        delayedVideoUpdater({ currentCarouselIndex, showVideoUIDelay, setVideoIdx, setVideoStatus })
      } else {
        setVideoIdx(currentCarouselIndex)
        setVideoStatus(undefined)
      }
    }
    videoChange()
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

  return (
    <>
      <VideoContentWrapper id="#video-content-wrapper" {...styleProps}>
        {videos.map(({ id, sources, previewImage }, index) => {
          const isSelected = index === videoIdx
          if (!isSelected) return null

          return (
            <LazyVideo
              key={id}
              onClick={toggleVideo}
              ref={setVideoElement}
              container={document.querySelector('#COLLECTION-ARTICLE') as HTMLElement}
              loadInView={firstPaintOver}
              forceLoad={forceLoad}
              videoProps={{ ...videoProps, poster: showPoster ? previewImage?.url : undefined }}
              sourcesProps={sources
                .map(({ url, mimeType }) => ({ src: url, type: mimeType }))
                .filter(({ type }) => type === 'video/mp4')}
              height={styleProps.height}
              width={styleProps.width}
              Loader={Spinner}
              videoDelay={!isMobileWidth && videoDelay}
              showTapToPlay={!isPlaying && videoProps?.autoPlay === false}
            />
          )
        })}
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

type Props = Params & { isOpen: boolean; zIndex?: number }
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

async function delayedVideoUpdater({
  currentCarouselIndex,
  showVideoUIDelay,
  setVideoIdx,
  setVideoStatus
}: {
  currentCarouselIndex: number
  showVideoUIDelay: (state: boolean) => void
  setVideoIdx: (idx: number) => void
  setVideoStatus: (status: undefined) => void
}) {
  showVideoUIDelay(true)
  await wait(500)
  setVideoIdx(currentCarouselIndex)
  await wait(500)
  setVideoStatus(undefined)
  showVideoUIDelay(false)
}
