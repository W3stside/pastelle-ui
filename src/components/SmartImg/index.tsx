import { forwardRef, useMemo } from 'react'
import { IKImage, IKContext } from 'imagekitio-react'
import useDetectScrollIntoView, { LoadInView } from 'hooks/useDetectScrollIntoView'
import useEffectRef from 'hooks/useEffectRef'
import styled from 'styled-components/macro'

export type ImageKitTransformation = { [x: string]: undefined | number | string | boolean }[]

interface BaseImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  pathSrcSet?: { [sizekey: string | number]: string }
  lq?: boolean
  lazy?: boolean
  forwardedRef?: React.ForwardedRef<any>
  transformation?: ImageKitTransformation
  loadInView?: LoadInView
}

type ImagePropsWithDefaultImage = BaseImageProps & {
  ikPath?: undefined
  defaultPath: string
}

type ImagePropsWithIkImage = BaseImageProps & {
  ikPath: string
  defaultPath?: undefined
}

export type SmartImageProps = ImagePropsWithDefaultImage | ImagePropsWithIkImage

const StyledPicture = styled.picture`
  height: 100%;
`

const DEFAULT_LQ_IP = {
  quality: 20,
  blur: 6
}
const DEFAULT_TRANSFORMATIONS = [{ pr: true }]
const BASE_INTERSECTION_OPTIONS = {
  threshold: 0.1,
  delay: 1000
}

export function ApiImage({
  defaultPath,
  pathSrcSet,
  transformation,
  loadInView,
  lazy,
  lq,
  forwardedRef
}: ImagePropsWithDefaultImage): JSX.Element | null
export function ApiImage({
  ikPath,
  pathSrcSet,
  transformation,
  loadInView,
  lazy,
  lq,
  forwardedRef
}: ImagePropsWithIkImage): JSX.Element | null
export function ApiImage({
  ikPath,
  defaultPath,
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

  return ikPath ? (
    <IKContext
      publicKey={process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
      transformationPosition="path"
      // authenticationEndpoint="http://www.yourserver.com/auth"
    >
      {/* Observable span to detect if in view */}
      <span ref={refToSet} />
      <IKImage
        // path={new URL(ikPath).pathname}
        src={!isInView ? undefined : ikPath}
        loading={lazy ? 'lazy' : 'eager'}
        lqip={LQIP}
        transformation={derivedTransformations}
        ref={forwardedRef}
      />
    </IKContext>
  ) : defaultPath ? (
    <>
      {/* Observable span to detect if in view */}
      <span ref={refToSet} />
      {
        <StyledPicture>
          {/* e.g [500, "shopify.com/thing_500.px"] // [1280, "shopify.com/thing_1280.px"] */}
          {pathSrcSet &&
            Object.entries(pathSrcSet).map(([size, url]) => (
              <source key={url} media={`(max-width: ${size}px)`} srcSet={url} />
            ))}
          <img src={!isInView ? undefined : defaultPath} loading="lazy" ref={forwardedRef} {...rest} />
        </StyledPicture>
      }
    </>
  ) : null
}

const SmartImg = forwardRef((props: SmartImageProps, ref) => <ApiImage {...(props as any)} forwardedRef={ref} />)
SmartImg.displayName = 'SmartImg'

export default SmartImg
