import { SmartImg } from '@past3lle/components'
import { SmartImgLoader } from '@/components/Loader/SmartImgLoader'
import { ShopImageSrcSet } from '@/types'

import { LogoContainer } from './styleds'
import Image from 'next/image'

export interface LogoProps {
  logoSrcSet?: ShopImageSrcSet
  src?: string
  parentNode: HTMLElement | null
  isHeader: boolean
}
export function Logo({ logoSrcSet, src, parentNode, isHeader }: LogoProps) {
  if (!logoSrcSet?.defaultUrl && !src) return null
  return (
    <LogoContainer isHeader={isHeader}>
      {logoSrcSet?.defaultUrl ? (
        <SmartImg
          path={{ defaultPath: logoSrcSet.defaultUrl }}
          pathSrcSet={logoSrcSet}
          lqImageOptions={{
            width: parentNode?.clientWidth || 0,
            height: parentNode?.clientHeight || 0,
            showLoadingIndicator: false,
          }}
          placeholderProps={{
            loadingContent: <SmartImgLoader />,
          }}
        />
      ) : (
        <Image src={src || ''} alt="logo" />
      )}
    </LogoContainer>
  )
}

export const HeaderLogo = (props: Omit<LogoProps, 'isHeader'>) => <Logo {...props} isHeader />
export const NavLogo = (props: Omit<LogoProps, 'isHeader'>) => <Logo {...props} isHeader={false} />
