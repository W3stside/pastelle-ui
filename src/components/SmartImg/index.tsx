import { forwardRef } from 'react'
import { IKImage, IKContext } from 'imagekitio-react'
import useDetectScrollIntoView, { LoadInView } from 'hooks/useDetectScrollIntoView'
import useEffectRef from 'hooks/useEffectRef'

export type ImageKitTransformation = { [x: string]: number | string }[]

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path: string
  lq?: boolean
  lazy?: boolean
  forwardedRef?: React.ForwardedRef<any>
  transformation?: ImageKitTransformation
  loadInView?: LoadInView
}

const DEFAULT_LQ_IP = {
  quality: 10
}

const DEFAULT_TRANSFORMATIONS = [{ pr: true }]
const BASE_INTERSECTION_OPTIONS = {
  threshold: 0.1
}
function ApiImage({ path, transformation = [], loadInView, lazy = true, lq = true, forwardedRef }: ImageProps) {
  const lqip = {
    ...DEFAULT_LQ_IP,
    active: lq
  }

  // test that path is a full url vs an addon i.e for imagekit
  const isFullUrl = new RegExp(/https?/gm).test(path)

  // load if in view only!
  const [refToSet, ref] = useEffectRef<HTMLSpanElement>(null)
  const isInView = useDetectScrollIntoView(
    !!loadInView?.conditionalCheck ? ref?.current : undefined,
    {
      ...BASE_INTERSECTION_OPTIONS,
      root: loadInView?.container || document
    },
    // default view state
    loadInView === undefined ? true : false
  )

  return !isFullUrl ? (
    <IKContext
      publicKey={process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
      transformationPosition="path"
      // authenticationEndpoint="http://www.yourserver.com/auth"
    >
      {/* Observable span to detect if in view */}
      <span ref={refToSet} />
      <IKImage
        path={isInView ? path : undefined}
        loading={lazy ? 'lazy' : 'eager'}
        lqip={lqip}
        transformation={[...DEFAULT_TRANSFORMATIONS, ...transformation]}
        ref={forwardedRef}
      />
    </IKContext>
  ) : (
    <>
      {/* Observable span to detect if in view */}
      <span ref={refToSet} />
      <img src={isInView ? path : undefined} loading="lazy" ref={forwardedRef} />
    </>
  )
}
const SmartImg = forwardRef((props: ImageProps, ref) => <ApiImage {...props} forwardedRef={ref} />)

SmartImg.displayName = 'SmartImg'

export default SmartImg
