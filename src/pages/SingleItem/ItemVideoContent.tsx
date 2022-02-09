import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'react-feather'

import { ButtonVariations } from 'components/Button'
import { ItemPageProps } from './AsideWithVideo'
import { VideoContentWrapper, ItemSubHeader, VideoControlButton } from './styleds'

const CONTROL_BUTTON_SIZE = 20

export const ItemVideoContent = ({
  itemMediaList,
  currentCarouselIndex
}: { currentCarouselIndex: number } & Pick<ItemPageProps, 'itemMediaList'>) => {
  const [videoStatus, setVideoStatus] = useState<'PLAYING' | 'PAUSED' | undefined>(undefined)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) return
    const video = videoRef.current

    function handleOnPlaying() {
      setVideoStatus('PLAYING')
    }

    function handleOnPaused() {
      setVideoStatus('PAUSED')
    }

    video.onplaying = handleOnPlaying
    video.onpause = handleOnPaused

    return () => {
      video.removeEventListener('onplaying', handleOnPlaying)
      video.removeEventListener('onpaused', handleOnPaused)
    }
  }, [])

  const toggleVideo = useCallback(() => {
    if (!videoRef.current) return

    if (videoStatus === 'PAUSED') {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }, [videoStatus])

  const isPaused = videoStatus === 'PAUSED'

  return (
    <>
      <VideoContentWrapper id="#video-content-wrapper">
        {itemMediaList.map(({ videoMedia: { video, poster } }, index) => {
          const isSelected = index === currentCarouselIndex
          if (!isSelected) return null

          return (
            <video loop muted autoPlay key={index} poster={poster} ref={videoRef}>
              <source src={video} type="video/webm" />
              {/* <source src={videoMP4} type="video/mp4" /> */}
            </video>
          )
        })}
      </VideoContentWrapper>
      {videoStatus && (
        <VideoControlButton variant={ButtonVariations.THEME} onClick={toggleVideo}>
          <ItemSubHeader>
            VIDEO
            {isPaused ? (
              <Play color="ghostwhite" fill="ghostwhite" size={CONTROL_BUTTON_SIZE} />
            ) : (
              <Pause size={CONTROL_BUTTON_SIZE} />
            )}
          </ItemSubHeader>
        </VideoControlButton>
      )}
    </>
  )
}
