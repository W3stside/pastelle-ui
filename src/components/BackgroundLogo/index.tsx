import { SmartImg } from '@past3lle/components'
import { useStateRef } from '@past3lle/hooks'
import { SmartImgLoader } from '@/components/Loader/SmartImgLoader'
import { useCallback, useMemo } from 'react'
import { ShopImageSrcSet } from '@/types'

import { LogoContainer } from './styleds'

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
        <img src={src} alt="logo" />
      )}
    </LogoContainer>
  )
}

export const HeaderLogo = (props: Omit<LogoProps, 'isHeader'>) => <Logo {...props} isHeader />
export const NavLogo = (props: Omit<LogoProps, 'isHeader'>) => <Logo {...props} isHeader={false} />

export default function useLogo(props: Omit<LogoProps, 'parentNode'>) {
  const [node, setNodeRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)

  return {
    Logo: useCallback(
      () => (props?.logoSrcSet || props?.src ? <Logo parentNode={node} {...props} /> : null),
      [node, props],
    ),
    ref: useMemo(
      () => ({
        setRef: setNodeRef,
        ref: node,
      }),
      [node, setNodeRef],
    ),
  }
}
