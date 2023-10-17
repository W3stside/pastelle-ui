import { ButtonVariations, RowProps, SmartVideo, SmartVideoProps } from '@past3lle/components'
import { getIsMobile, wait } from '@past3lle/utils'
import { Z_INDEXES } from 'constants/config'
import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Pause, Play } from 'react-feather'
import { useLocation } from 'react-router-dom'
import { FragmentProductVideoFragment } from 'shopify/graphql/types'
import { useUpdateShowcaseVideoSettings } from 'state/user/hooks'

import {
  ProductSubHeader,
  VideoContentWrapper,
  VideoControlButton as VideoControlButtonStyled,
} from '../common/styleds'

export type ShowcaseVideo = FragmentProductVideoFragment & { isFallback?: boolean }
export interface ItemVideoContentProps extends RowProps {
  videos: ShowcaseVideo[]
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
  smartFill?: {
    full?: boolean
    side?: boolean
  }
}
const CONTROL_BUTTON_SIZE = '16px'
const EMPTY_LIST: HTMLVideoElement[] = []
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
  smartFill,
  ...styleProps
}: ItemVideoContentProps) => {
  const [videoIdx, setVideoIdx] = useState(currentCarouselIndex)
  const [{ autoplay, status: videoStatus }, updateVideoSettings] = useUpdateShowcaseVideoSettings()

  // Keep a running map of videos promised to play.
  // Map is cleared when video promises are resolved
  const [videosList, setVideoNodesList] = useState<HTMLVideoElement[]>(EMPTY_LIST)

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

  const currentVideoId = videos?.[0].id

  // EFFECT: sync redux showcase video state w/actual video ref play state
  useEffect(() => {
    if (!videosList?.length) return

    // loop play each video
    if (isPlaying) videosList.forEach((vid) => _playVideoThenable(vid))
    // Video was paused
    // loop pause all videos
    else if (isPaused) videosList.forEach((vid) => vid.pause())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, isPlaying, currentVideoId])

  // EFFECT: sync video play status with AUTOPLAY and current PLAY/PAUSE status
  const location = useLocation()
  useEffect(() => {
    if (autoplay && isPaused) updateVideoSettings({ autoplay, status: 'play' })
    else if (!autoplay && isPlaying) updateVideoSettings({ autoplay, status: 'pause' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, location.key, currentVideoId])

  // EFFECT: State resets
  useEffect(() => {
    setVideoNodesList(EMPTY_LIST)

    return () => {
      setVideoNodesList(EMPTY_LIST)
    }
  }, [currentVideoId, location.key])

  const toggleVideo = useCallback(
    () => updateVideoSettings({ autoplay, status: isPlaying ? 'pause' : 'play' }),
    [autoplay, isPlaying, updateVideoSettings]
  )

  const videosContent = useMemo(
    () =>
      videos.map(({ id, sources, previewImage }, index) => {
        const isSelected = currentCarouselIndex === null || index === videoIdx
        if (!isSelected) return null

        const commonProps = {
          width: 'auto',
          showError,
          container: window.document.body,
          loadInView: firstPaintOver,
          forceLoad,
          videoProps: {
            ...videoProps,
            poster: showPoster ? previewImage?.url : undefined,
          },
          sourcesProps: sources.map(({ url, mimeType }) => ({ src: url, type: mimeType })),
          height: styleProps.height,
          videoDelay: !isMobileWidth && videoDelay,
          showTapToPlay: getIsMobile() && !isPlaying,
          ctaOverlayProps: {
            $zIndex: Z_INDEXES.PRODUCT_VIDEOS,
            $width: '40%',
          },
        }

        const bgVideosFilter = ' blur(8px)'

        return (
          <Fragment key={id}>
            {(smartFill?.full || smartFill?.side) && (
              <SmartVideo
                {...commonProps}
                ref={(node) => node && setVideoNodesList((state) => [...state, node])}
                marginLeft="auto"
                videoProps={{
                  ...commonProps.videoProps,
                  style: {
                    ...commonProps.videoProps.style,
                    filter: bgVideosFilter,
                    position: smartFill?.full ? 'fixed' : 'inherit',
                    top: 0,
                    right: 0,
                    height: '100%',
                  },
                }}
              />
            )}
            <SmartVideo
              {...commonProps}
              margin={smartFill ? '0' : isMobileWidth ? '0 auto' : '0 0 0 auto'}
              ref={(node) => node && setVideoNodesList((state) => [...state, node])}
              autoPlayOptions={autoplay ? undefined : autoPlayOptions}
            />
          </Fragment>
        )
      }),
    // We don't need to track onVideoClick
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      smartFill,
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
      videoDelay,
      videoIdx,
      videoProps,
      videos,
    ]
  )

  return (
    <>
      <VideoContentWrapper
        id="#video-content-wrapper"
        {...styleProps}
        // Mobile only. Showcase shows in carousel
        onClick={isMobileWidth ? toggleVideo : undefined}
      >
        {videosContent}
        {videoOverlay}
      </VideoContentWrapper>
      {/* PLAY/PAUSE */}
      {videoStatus && !isMobileWidth && <VideoControlButton callback={toggleVideo} isPlaying={isPlaying} />}
    </>
  )
}

type VideoControlButtonParams = {
  callback: () => void
  isPlaying: boolean
}
function VideoControlButton({ callback, isPlaying }: VideoControlButtonParams) {
  return (
    <VideoControlButtonStyled
      backgroundColor={'#0000002b'}
      buttonVariant={ButtonVariations.SECONDARY}
      onClick={callback}
    >
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

function _playVideoThenable(video: HTMLVideoElement) {
  return video
    .play()
    .then(() => video)
    .catch((error) => {
      console.error(error)
      return video
    })
}
