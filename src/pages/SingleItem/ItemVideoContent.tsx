import { useCallback, useEffect, useState } from 'react'

import { ItemSubHeader, VideoContentWrapper, VideoControlButton } from './styleds'
import LazyVideo from 'components/LazyVideo'
import { Spinner } from 'theme'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'
import { ButtonVariations } from 'components/Button'
import { Play, Pause } from 'react-feather'
import { RowProps } from 'components/Layout'

interface Params extends RowProps {
  videos: FragmentProductVideoFragment[]
  firstPaintOver?: boolean
  currentCarouselIndex: number
  forceLoad?: boolean
  zIndex?: number
}
const CONTROL_BUTTON_SIZE = 12
export const ItemVideoContent = ({
  videos,
  currentCarouselIndex,
  firstPaintOver,
  forceLoad,
  ...styleProps
}: Params) => {
  const [videoStatus, setVideoStatus] = useState<'PLAYING' | 'PAUSED' | undefined>(undefined)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!videoElement) return

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
  }, [videoElement])

  const isPaused = videoStatus === 'PAUSED'

  const toggleVideo = useCallback(() => {
    if (!videoElement) return

    if (isPaused) {
      videoElement.play()
    } else {
      videoElement.pause()
    }
  }, [isPaused, videoElement])

  return (
    <>
      <VideoContentWrapper id="#video-content-wrapper" {...styleProps}>
        {videos.map(({ id, sources }, index) => {
          const isSelected = index === currentCarouselIndex
          if (!isSelected) return null

          return (
            <LazyVideo
              key={id}
              ref={setVideoElement}
              container={document.querySelector('#CATALOG-ARTICLE') as HTMLElement}
              loadInView={firstPaintOver}
              forceLoad={forceLoad}
              videoProps={{
                style: {
                  marginLeft: 'auto'
                }
              }}
              sourcesProps={sources
                .map(({ url, mimeType }) => ({ src: url, type: mimeType }))
                .filter(({ type }) => type === 'video/mp4')}
              height="100%"
              Loader={Spinner}
              onClick={toggleVideo}
            />
          )
        })}
      </VideoContentWrapper>
      {videoStatus && (
        <VideoControlButton variant={ButtonVariations.SECONDARY} onClick={toggleVideo}>
          <ItemSubHeader>
            {isPaused ? (
              <Play color="ghostwhite" fill="ghostwhite" size={CONTROL_BUTTON_SIZE} />
            ) : (
              <Pause color="ghostwhite" fill="ghostwhite" size={CONTROL_BUTTON_SIZE} />
            )}
          </ItemSubHeader>
        </VideoControlButton>
      )}
    </>
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
