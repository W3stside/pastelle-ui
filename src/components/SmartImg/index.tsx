import { forwardRef, Fragment, useMemo } from 'react'
import { IKImage, IKContext } from 'imagekitio-react'
import useDetectScrollIntoView, { LoadInView } from 'hooks/useDetectScrollIntoView'
import useEffectRef from 'hooks/useEffectRef'
import styled from 'styled-components/macro'
import { DDPXImageUrlMap } from 'components/Carousel'
import { MediaWidths } from 'theme/styles/mediaQueries'

export type ImageKitTransformation = { [x: string]: undefined | number | string | boolean }[]

interface BaseImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  pathSrcSet?: { [sizekey in MediaWidths]: DDPXImageUrlMap }
  lq?: boolean
  lazy?: boolean
  forwardedRef?: React.ForwardedRef<any>
  transformation?: ImageKitTransformation
  loadInView?: LoadInView
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

  return path?.ikPath ? (
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
              <source media={`only screen and (min-resolution: 3x) and (max-width: ${size}px)`} srcSet={dpiMap['3x']} />
              <source media={`only screen and (min-resolution: 2x) and (max-width: ${size}px)`} srcSet={dpiMap['2x']} />
              <source media={`only screen and (max-width: ${size}px)`} srcSet={dpiMap['1x']} />
            </Fragment>
          ))}
        <img src={!isInView ? undefined : path?.defaultPath} loading="lazy" ref={forwardedRef} {...rest} />
      </StyledPicture>
    </>
  ) : null
}

const SmartImg = forwardRef((props: SmartImageProps, ref) => <ApiImage {...props} forwardedRef={ref} />)
SmartImg.displayName = 'SmartImg'

export default SmartImg
