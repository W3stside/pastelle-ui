import SmartImg from 'components/SmartImg'
import { SingleItemPageProps } from 'pages/SingleItem/AsideWithVideo'
import { LogoContainer } from './styleds'

export interface LogoProps {
  logoSrcSet: SingleItemPageProps['headerLogo']
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
