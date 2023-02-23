import { ButtonVariations, RowProps, SmartVideo, SmartVideoProps } from '@past3lle/components'
import { usePrevious } from '@past3lle/hooks'
import { devDebug, isMobile, wait } from '@past3lle/utils'
import { Z_INDEXES } from 'constants/config'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pause, Play } from 'react-feather'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'
import { useOnScreenProductHandle } from 'state/collection/hooks'
import { useUpdateShowcaseVideoSettings } from 'state/user/hooks'

import {
  ProductSubHeader,
  VideoContentWrapper,
  VideoControlButton as VideoControlButtonStyled,
} from '../common/styleds'

export interface ItemVideoContentProps extends RowProps {
  videos: FragmentProductVideoFragment[]
  firstPaintOver?: boolean
  currentCarouselIndex: number | null
  forceLoad?: boolean
  showPoster?: boolean
  zIndex?: number
  isMobileWidth: boolean
  videoProps?: SmartVideoProps['videoProps']
  autoPlayOptions?: SmartVideoProps['autoPlayOptions']
  showError?: boolean
}
const CONTROL_BUTTON_SIZE = '16px'
export const ItemVideoContent = ({
  videos,
  currentCarouselIndex,
  firstPaintOver,
  forceLoad,
  showPoster = true,
  videoProps,
  isMobileWidth,
  showError,
  autoPlayOptions,
  ...styleProps
}: ItemVideoContentProps) => {
  const [videoIdx, setVideoIdx] = useState(currentCarouselIndex)
  const [{ autoplay, status: videoStatus }, updateVideoSettings] = useUpdateShowcaseVideoSettings()
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const [videoDelay, showVideoUIDelay] = useState<boolean>(false)
  const currentHandle = useOnScreenProductHandle()

  useEffect(() => {
    async function videoChange() {
      // if is web
      if (!isMobileWidth && currentCarouselIndex !== null) {
        _delayedVideoUpdater({ currentCarouselIndex, showVideoUIDelay, setVideoIdx })
      } else {
        setVideoIdx(currentCarouselIndex)
      }
    }
    currentCarouselIndex !== null && videoChange()
  }, [currentCarouselIndex, isMobileWidth])

  const isPlaying = videoStatus === 'play'
  const prevAutoplay = usePrevious(autoplay)
  const prevVideoStatus = usePrevious(videoStatus)
  useEffect(() => {
    if (!videoElement) return
    const isPaused = videoStatus === 'pause'
    const isPlaying = !isPaused

    if (prevAutoplay === false && autoplay && isPaused) {
      updateVideoSettings({ autoplay: true, status: 'play' })
    } else if (prevAutoplay === true && !autoplay && isPlaying) {
      updateVideoSettings({ autoplay: false, status: 'pause' })
    } else if (isPlaying) {
      videoElement.play()
    } else if (isPaused) {
      videoElement.pause()
    }

    return () => {
      if (autoplay && isPaused) {
        updateVideoSettings({ autoplay, status: 'play' })
      } else if (!autoplay && isPlaying) {
        updateVideoSettings({ autoplay, status: 'pause' })
      }
    }
  }, [autoplay, prevAutoplay, prevVideoStatus, updateVideoSettings, videoElement, videoStatus, currentHandle?.id])

  const toggleVideo = useCallback(
    () => updateVideoSettings({ autoplay, status: isPlaying ? 'pause' : 'play' }),
    [autoplay, isPlaying, updateVideoSettings]
  )

  const videosContent = useMemo(
    () =>
      videos.map(({ id, sources, previewImage }, index) => {
        const isSelected = currentCarouselIndex === null || index === videoIdx
        if (!isSelected) return null

        return (
          <SmartVideo
            key={id}
            showError={showError}
            onClick={toggleVideo}
            ref={setVideoElement}
            container={document.querySelector('#COLLECTION-ARTICLE') as HTMLElement}
            loadInView={firstPaintOver}
            forceLoad={forceLoad}
            videoProps={{
              ...videoProps,
              poster: showPoster ? previewImage?.url : undefined,
            }}
            sourcesProps={sources.map(({ url, mimeType }) => ({ src: url, type: mimeType }))}
            height={styleProps.height}
            width={styleProps.width}
            videoDelay={!isMobileWidth && videoDelay}
            showTapToPlay={isMobile && (!isPlaying || videoProps?.autoPlay === false)}
            autoPlayOptions={autoPlayOptions}
            ctaOverlayProps={{
              $zIndex: Z_INDEXES.PRODUCT_VIDEOS,
            }}
            onResize={devDebug}
            onResizeCapture={devDebug}
          />
        )
      }),
    [
      videos,
      currentCarouselIndex,
      videoIdx,
      showError,
      toggleVideo,
      firstPaintOver,
      forceLoad,
      videoProps,
      showPoster,
      styleProps.height,
      styleProps.width,
      isMobileWidth,
      videoDelay,
      isPlaying,
      autoPlayOptions,
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
      <ProductSubHeader>
        {isPlaying ? (
          <>
            <Pause color="ghostwhite" fill="ghostwhite" size={CONTROL_BUTTON_SIZE} /> PAUSE
          </>
        ) : (
          <>
            <Play color="ghostwhite" fill="ghostwhite" size={CONTROL_BUTTON_SIZE} /> PLAY{' '}
          </>
        )}
      </ProductSubHeader>
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
  setVideoIdx,
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

/* 
// VIDEO EVENT LISTNERS
useEffect(() => {
    if (!videoElement) return

    function handleOnPlaying() {
      console.debug('play')
    }

    function handleOnPaused() {
      console.debug('pause')
    }

    const _handleTimeUpdate = (e?: any) => {
      if (!autoplay && autoPlayOptions && (e?.target?.currentTime || 0) >= autoPlayOptions.stopTime) {
        videoElement?.removeEventListener('timeupdate', _handleTimeUpdate)
        console.debug('timeupdate event listener fired')
        // videoElement?.pause()
      }
    }

    videoElement.addEventListener('playing', handleOnPlaying)
    videoElement.addEventListener('pause', handleOnPaused)
    videoElement.addEventListener('timeupdate', _handleTimeUpdate)

    return () => {
      videoElement.removeEventListener('playing', handleOnPlaying)
      videoElement.removeEventListener('pause', handleOnPaused)
      videoElement?.removeEventListener('timeupdate', _handleTimeUpdate)
    }
  }, [videoElement, videoStatus, videoElement?.currentSrc, autoplay, autoPlayOptions])
*/
