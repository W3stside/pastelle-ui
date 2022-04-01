import { /* useCallback ,*/ useEffect, useState } from 'react'
// import { Pause, Play } from 'react-feather'

import /* ButtonVariations */ 'components/Button'
import { ItemPageProps } from './AsideWithVideo'
import { VideoContentWrapper /* , ItemSubHeader, VideoControlButton */ } from './styleds'
import LazyVideo from 'components/LazyVideo'
import { Spinner } from 'theme'

// const CONTROL_BUTTON_SIZE = 20

export const ItemVideoContent = ({
  itemMediaList,
  currentCarouselIndex,
  firstPaintOver
}: // hide
{ currentCarouselIndex: number; hide?: boolean; firstPaintOver?: boolean } & Pick<ItemPageProps, 'itemMediaList'>) => {
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
        {itemMediaList.map(({ videoMedia: { path, lowq } }, index) => {
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
              sourcesProps={[
                { src: process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT + path, type: 'video/mp4' },
                { src: process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT + path + '?tr=' + lowq, type: 'video/mp4' }
              ]}
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
