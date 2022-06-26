import { /* useCallback ,*/ useEffect, useState } from 'react'
// import { Pause, Play } from 'react-feather'

// import /* ButtonVariations */ 'components/Button'
import { VideoContentWrapper /* , ItemSubHeader, VideoControlButton */ } from './styleds'
import LazyVideo from 'components/LazyVideo'
import { Spinner } from 'theme'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'

// const CONTROL_BUTTON_SIZE = 20

interface Params {
  videos: FragmentProductVideoFragment[]
  firstPaintOver?: boolean
  currentCarouselIndex: number
  // hide?: boolean
}

export const ItemVideoContent = ({ videos, currentCarouselIndex, firstPaintOver /* , hide */ }: Params) => {
  const [, /* videoStatus */ setVideoStatus] = useState<'PLAYING' | 'PAUSED' | undefined>(undefined)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!videoElement) return
    const video = videoElement

    function handleOnPlaying() {
      setVideoStatus('PLAYING')
    }

    function handleOnPaused() {
      setVideoStatus('PAUSED')
    }

    video.addEventListener('playing', handleOnPlaying)
    video.addEventListener('pause', handleOnPaused)

    return () => {
      video.removeEventListener('playing', handleOnPlaying)
      video.removeEventListener('pause', handleOnPaused)
    }
  }, [videoElement])

  /* const toggleVideo = useCallback(() => {
    if (!videoElement) return

    if (videoStatus === 'PAUSED') {
      videoElement.play()
    } else {
      videoElement.pause()
    }
  }, [videoElement, videoStatus])

  const isPaused = videoStatus === 'PAUSED' */

  // TODO: show loader and set hide to also depend on active index
  // if (hide) return null

  return (
    <>
      <VideoContentWrapper id="#video-content-wrapper">
        {videos.map(({ sources }, index) => {
          const isSelected = index === currentCarouselIndex
          if (!isSelected) return null

          return (
            <LazyVideo
              key={index}
              ref={setVideoElement}
              container={document.querySelector('#CATALOG-ARTICLE') as HTMLElement}
              loadInView={firstPaintOver}
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
            />
          )
        })}
      </VideoContentWrapper>
      {/* videoStatus && (
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
      ) */}
    </>
  )
}
