import { SmartImg } from '@past3lle/components'
import { useStateRef } from '@past3lle/hooks'
import { ShopImageSrcSet } from 'types'

import { LogoContainer } from './styleds'

export interface LogoProps {
  logoSrcSet: ShopImageSrcSet
  parentNode: HTMLElement | null
  isHeader: boolean
}
export function Logo({ logoSrcSet, parentNode, isHeader }: LogoProps) {
  if (!logoSrcSet?.defaultUrl) return null
  return (
    <LogoContainer isHeader={isHeader}>
      <SmartImg
        path={{ defaultPath: logoSrcSet.defaultUrl }}
        pathSrcSet={logoSrcSet}
        lqImageOptions={{
          width: parentNode?.clientWidth || 0,
          height: parentNode?.clientHeight || 0,
          showLoadingIndicator: false
        }}
      />
    </LogoContainer>
  )
}

export const HeaderLogo = (props: Omit<LogoProps, 'isHeader'>) => <Logo {...props} isHeader />
export const NavLogo = (props: Omit<LogoProps, 'isHeader'>) => <Logo {...props} isHeader={false} />

export default function useLogo(props: Omit<LogoProps, 'parentNode'>) {
  const [node, setNodeRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)

  return {
    Logo: () => (props.logoSrcSet ? <Logo parentNode={node} {...props} /> : null),
    ref: {
      setRef: setNodeRef,
      ref: node
    }
  }
}
