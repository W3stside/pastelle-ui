import { ButtonVariations, RowProps, SmartVideo, SmartVideoProps } from '@past3lle/components'
import { useDetectScrollIntoView } from '@past3lle/hooks'
import { devError, getIsMobile, wait } from '@past3lle/utils'
import { Z_INDEXES } from '@/constants/config'
import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Pause, Play } from 'react-feather'
import { FragmentProductVideoFragment } from '@/shopify/graphql/types'
import { useUpdateShowcaseVideoSettings } from '@/state/user/hooks'

import {
  ProductSubHeader,
  VideoContentWrapper,
  VideoControlButton as VideoControlButtonStyled,
} from '../../PagesComponents/styleds'
import { usePathname } from 'next/navigation'

export type ShowcaseVideo = FragmentProductVideoFragment & { isFallback?: boolean }
export interface ItemVideoContentProps extends RowProps {
  videos: ShowcaseVideo[]
  firstPaintOver?: boolean
  currentCarouselIndex: number | null
  forceLoad?: boolean
  loadInViewOptions?: SmartVideoProps['loadInViewOptions']
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

const IS_SERVER = typeof globalThis?.window == 'undefined'

const CONTROL_BUTTON_SIZE = '16px'
const EMPTY_MAP: Map<string, HTMLVideoElement> = new Map()
const LOAD_IN_VIEW_DELAY = 500
const LOAD_IN_VIEW_THRESHOLD = 0.01

const ItemVideoContent = ({
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
  loadInViewOptions,
  ...styleProps
}: ItemVideoContentProps) => {
  const [videoIdx, setVideoIdx] = useState(currentCarouselIndex)
  const [{ autoplay, status: videoStatus }, updateVideoSettings] = useUpdateShowcaseVideoSettings()

  // Keep a running map of videos promised to play.
  // Map is cleared when video promises are resolved
  const [videosMap, setVideoNodesMap] = useState<Map<string, HTMLVideoElement>>(EMPTY_MAP)
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
    if (currentCarouselIndex !== null) videoChange()
  }, [currentCarouselIndex, isMobileWidth])

  const isPlaying = videoStatus === 'play'
  const isPaused = videoStatus === 'pause'

  const currentVideoId = videos?.[0].id

  // EFFECT: sync redux showcase video state w/actual video ref play state
  useEffect(() => {
    if (!videosMap?.size) return

    // loop play each video
    if (isPlaying) videosMap.forEach((vid) => _playVideoThenable(vid))
    // loop pause all videos
    else if (isPaused) videosMap.forEach((vid) => vid.pause())
  }, [isPaused, isPlaying, currentVideoId, videosMap])

  // Pause when not on screen
  const isInView = useDetectScrollIntoView(
    videosMap.get('MAIN'),
    // @ts-expect-error problem in types of internals
    { delay: LOAD_IN_VIEW_DELAY, threshold: LOAD_IN_VIEW_THRESHOLD, continuous: true },
    !isMobileWidth,
  )

  // EFFECT: sync video play status with AUTOPLAY/IN VIEW state and current PLAY/PAUSE status
  const pathname = usePathname()
  useEffect(() => {
    if ((autoplay || isInView) && isPaused) updateVideoSettings({ autoplay, status: 'play' })
    else if ((!autoplay || !isInView) && isPlaying) updateVideoSettings({ autoplay, status: 'pause' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, isInView, pathname, currentVideoId])

  const toggleVideo = useCallback(
    () => updateVideoSettings({ autoplay, status: isPlaying ? 'pause' : 'play' }),
    [autoplay, isPlaying, updateVideoSettings],
  )

  const shouldSmartFillFull = smartFill?.full
  const shouldSmartFillSide = smartFill?.side

  // reduce over sources list to get videos. filter out empties
  const VideosComponents = useMemo(
    () =>
      videos.reduce((acc, { id, sources, previewImage }, index) => {
        const isSelected = currentCarouselIndex === null || index === videoIdx
        if (!isSelected || !sources?.length) return acc

        const commonProps = {
          width: 'auto',
          showError,
          container: IS_SERVER ? null : window.document.body,
          loadInView: firstPaintOver,
          forceLoad,
          loadInViewOptions,
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

        acc.push(
          <Fragment key={id}>
            {(shouldSmartFillFull || shouldSmartFillSide) && (
              <SmartVideo
                {...commonProps}
                // Get the lowest quality src
                sourcesProps={commonProps.sourcesProps.filter((src) => !src.src.includes('720'))}
                ref={(node) => (node ? setVideoNodesMap((state) => new Map(state).set('ALT', node)) : undefined)}
                marginLeft="auto"
                videoProps={{
                  ...commonProps.videoProps,
                  style: {
                    ...commonProps.videoProps.style,
                    filter: bgVideosFilter,
                    position: shouldSmartFillFull ? 'fixed' : 'inherit',
                    top: 0,
                    right: 0,
                    height: '100%',
                  },
                }}
              />
            )}
            <SmartVideo
              {...commonProps}
              justifyContent={isMobileWidth ? 'center' : 'end'}
              ref={(node) => (node ? setVideoNodesMap((state) => new Map(state).set('MAIN', node)) : undefined)}
              autoPlayOptions={autoplay ? undefined : autoPlayOptions}
            />
          </Fragment>,
        )

        return acc
      }, [] as ReactNode[]),
    // We don't need to track onVideoClick
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      IS_SERVER,
      shouldSmartFillFull,
      shouldSmartFillSide,
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
    ],
  )

  if (!VideosComponents?.length) return null

  return (
    <>
      <VideoContentWrapper
        id="#video-content-wrapper"
        {...styleProps}
        // Mobile only. Showcase shows in carousel
        onClick={isMobileWidth ? toggleVideo : undefined}
      >
        {VideosComponents}
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
      devError(error)
      return video
    })
}

export default ItemVideoContent
