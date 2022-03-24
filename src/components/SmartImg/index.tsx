import { IKImage, IKContext } from 'imagekitio-react'
import { forwardRef } from 'react'

export type ImageKitTransformation = { [x: string]: number | string }[]

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path: string
  lq?: boolean
  lazy?: boolean
  forwardedRef?: React.ForwardedRef<any>
  transformation?: ImageKitTransformation
}

const DEFAULT_LQ_IP = {
  quality: 10
}

const DEFAULT_TRANSFORMATIONS = [
  {
    pr: true
  }
]

function ApiImage({ path, transformation = [], lazy = true, lq = true, forwardedRef }: ImageProps) {
  const lqip = {
    ...DEFAULT_LQ_IP,
    active: lq
  }

  return (
    <IKContext
      publicKey={process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
      transformationPosition="path"
      // authenticationEndpoint="http://www.yourserver.com/auth"
    >
      <IKImage
        path={path}
        loading={lazy ? 'lazy' : 'eager'}
        lqip={lqip}
        transformation={[...DEFAULT_TRANSFORMATIONS, ...transformation]}
        ref={forwardedRef}
      />
    </IKContext>
  )
}
const SmartImg = forwardRef((props: ImageProps, ref) => <ApiImage {...props} forwardedRef={ref} />)

SmartImg.displayName = 'ApiImage'

export default SmartImg
