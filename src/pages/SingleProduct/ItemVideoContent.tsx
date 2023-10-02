import { ButtonVariations, RowProps, SmartVideo, SmartVideoProps } from '@past3lle/components'
import { getIsMobile, wait } from '@past3lle/utils'
import { Z_INDEXES } from 'constants/config'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Pause, Play } from 'react-feather'
import { useLocation } from 'react-router-dom'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'
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
  videoOverlay?: ReactNode
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
  videoOverlay,
  ...styleProps
}: ItemVideoContentProps) => {
  const [videoIdx, setVideoIdx] = useState(currentCarouselIndex)
  const [{ autoplay, status: videoStatus }, updateVideoSettings] = useUpdateShowcaseVideoSettings()
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const [videoDelay, showVideoUIDelay] = useState<boolean>(false)

  // EFFECT: on video change inside showcase (e.g gender, height), show loader
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
  const isPaused = videoStatus === 'pause'

  // EFFECT: sync redux showcase video state w/actual video ref play state
  useEffect(() => {
    if (!videoElement) return

    if (isPlaying) {
      videoElement.play()
    } else if (isPaused) {
      videoElement.pause()
    }
  }, [isPaused, isPlaying, videoElement])

  // EFFECT: sync video play status with AUTOPLAY and current PLAY/PAUSE status
  const location = useLocation()
  useEffect(() => {
    if (autoplay && isPaused) {
      updateVideoSettings({ autoplay, status: 'play' })
    } else if (!autoplay && isPlaying) {
      updateVideoSettings({ autoplay, status: 'pause' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, location.key])

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
            handleClick={() => updateVideoSettings({ autoplay, status: isPlaying ? 'pause' : 'play' })}
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
            showTapToPlay={getIsMobile() && (!isPlaying || videoProps?.autoPlay === false)}
            autoPlayOptions={autoplay ? undefined : autoPlayOptions}
            ctaOverlayProps={{
              $zIndex: Z_INDEXES.PRODUCT_VIDEOS,
            }}
          />
        )
      }),
    [
      autoPlayOptions,
      autoplay,
      currentCarouselIndex,
      firstPaintOver,
      forceLoad,
      isMobileWidth,
      isPlaying,
      showError,
      showPoster,
      styleProps.height,
      styleProps.width,
      updateVideoSettings,
      videoDelay,
      videoIdx,
      videoProps,
      videos,
    ]
  )

  return (
    <>
      <VideoContentWrapper id="#video-content-wrapper" {...styleProps}>
        {videosContent}
        {videoOverlay}
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
    <VideoControlButtonStyled buttonVariant={ButtonVariations.SECONDARY} onClick={callback}>
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
