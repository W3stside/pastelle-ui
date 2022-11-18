import { ForwardedRef, forwardRef, Fragment, ReactNode, useMemo } from 'react'
import { IKImage, IKContext } from 'imagekitio-react'
import useDetectScrollIntoView, { LoadInView } from 'hooks/useDetectScrollIntoView'
import useEffectRef from 'hooks/useEffectRef'
import styled from 'styled-components/macro'
import { DDPXImageUrlMap } from 'components/Carousel'
import { MediaWidths } from 'theme/styles/mediaQueries'
import useStateRef from 'hooks/useStateRef'

import useImageLoadingEvent from 'hooks/useImageLoadingEvent'
import { ColumnCenter } from 'components/Layout'
import { ThemeModes } from 'theme/styled'

export type ImageKitTransformation = { [x: string]: undefined | number | string | boolean }[]

interface BaseImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  pathSrcSet?: { [sizekey in MediaWidths]: DDPXImageUrlMap }
  lq?: boolean
  lazy?: boolean
  forwardedRef?: React.ForwardedRef<HTMLImageElement>
  transformation?: ImageKitTransformation
  loadInView?: LoadInView
  loadingComponent?: ReactNode
}

type ImagePropsWithDefaultImage = BaseImageProps & {
  path: { defaultPath: string }
}

type ImagePropsWithIkImage = BaseImageProps & {
  path: { ikPath: string }
}

export type SmartImageProps = (ImagePropsWithDefaultImage | ImagePropsWithIkImage) & { path: any }

const StyledPicture = styled.picture`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const PlaceholderPicture = styled(StyledPicture)<{ bgColor?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  font-size: 300%;
  font-weight: 100;
  background-color: ${({ theme, bgColor = theme.blackOpaque1 }) => bgColor};
  filter: brightness(0.7);
  opacity: 0.98;

  > div {
    color: ${({ theme }) => (theme.mode === ThemeModes.DARK ? theme.offWhite : theme.offWhite)};
    font-weight: 100;
    font-size: 150%;
    letter-spacing: -1px;
    line-height: 0.8;
  }
`

const DEFAULT_LQ_IP = {
  quality: 10,
  blur: 2
}
const DEFAULT_TRANSFORMATIONS = [{ pr: true }]
const BASE_INTERSECTION_OPTIONS = {
  threshold: 0.1,
  delay: 1000
}

export function ApiImage({
  path,
  pathSrcSet,
  transformation,
  loadInView,
  lazy,
  lq,
  forwardedRef
}: ImagePropsWithDefaultImage): JSX.Element | null
export function ApiImage({
  path,
  pathSrcSet,
  transformation,
  loadInView,
  lazy,
  lq,
  forwardedRef
}: ImagePropsWithIkImage): JSX.Element | null
export function ApiImage({
  path,
  pathSrcSet,
  transformation = DEFAULT_TRANSFORMATIONS,
  loadInView,
  lazy = true,
  lq = true,
  forwardedRef,
  loadingComponent,
  ...rest
}: SmartImageProps): JSX.Element | null {
  // load if in view only!
  const [refToSet, ref] = useEffectRef<HTMLSpanElement>(null)
  const isInView = useDetectScrollIntoView(
    !!loadInView?.conditionalCheck ? ref?.current : undefined,
    {
      ...BASE_INTERSECTION_OPTIONS,
      root: loadInView?.container || document
    },
    // default view state
    loadInView === undefined
  )

  const [LQIP, derivedTransformations] = useMemo(() => [{ ...DEFAULT_LQ_IP, active: lq }, transformation], [
    lq,
    transformation
  ])

  const [innerImgRef, setInnerRef] = useStateRef(null, node => node)
  const imageLoaded = useImageLoadingEvent(innerImgRef)

  return (
    <>
      {!imageLoaded && loadingComponent && (
        <PlaceholderPicture>
          <ColumnCenter>
            <div>Loading content...</div>
          </ColumnCenter>
        </PlaceholderPicture>
      )}
      {path?.ikPath ? (
        <IKContext
          publicKey={process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}
          urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
          transformationPosition="path"
        >
          {/* Observable span to detect if in view */}
          <span ref={refToSet} />
          <IKImage
            // path={path?.ikPath.replace(process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT as string, '')}
            src={!isInView ? undefined : path?.ikPath}
            lqip={LQIP}
            transformation={derivedTransformations}
            ref={forwardedRef}
            // lazy breaks for itemLogo in AsideWithVideo - never sets intersecting to true
            // thus never loads fullSrcUrl (stuck to lq)
            loading={lazy ? 'lazy' : 'eager'}
          />
        </IKContext>
      ) : path?.defaultPath ? (
        <>
          {/* Observable span to detect if in view */}
          <span ref={refToSet} />
          <StyledPicture>
            {/* e.g [500, { 1x: 'cdn.shopify.com/123/image_500x@1x.webp', 2x: 'cdn.shopify.com/123/image_500x@2x.webp' }] */}
            {pathSrcSet &&
              Object.entries(pathSrcSet).map(([size, dpiMap]) => (
                <Fragment key={size}>
                  <source
                    media={`only screen and (min-resolution: 3x) and (max-width: ${size}px)`}
                    srcSet={dpiMap['3x']}
                    type="image/webp"
                  />
                  <source
                    media={`only screen and (min-resolution: 2x) and (max-width: ${size}px)`}
                    srcSet={dpiMap['2x']}
                    type="image/webp"
                  />
                  <source media={`only screen and (max-width: ${size}px)`} srcSet={dpiMap['1x']} type="image/webp" />
                </Fragment>
              ))}
            <img
              src={!isInView ? undefined : path?.defaultPath}
              loading="lazy"
              ref={node => {
                typeof forwardedRef === 'function'
                  ? forwardedRef(node)
                  : forwardedRef?.current
                  ? (forwardedRef.current = node)
                  : null
                setInnerRef(node)
              }}
              {...rest}
            />
          </StyledPicture>
        </>
      ) : null}
    </>
  )
}

const SmartImg = forwardRef((props: SmartImageProps, ref: ForwardedRef<HTMLImageElement>) => (
  <ApiImage {...props} forwardedRef={ref} />
))
SmartImg.displayName = 'SmartImg'

export default SmartImg
