import { useMemo } from 'react'
import { TextProps } from 'rebass'
import styled from 'styled-components/macro'
import { MEDIA_WIDTHS } from 'theme/styles/mediaQueries'
import { ItemHeader, ItemHeaderProps } from 'pages/common/styleds'
import { useGetWindowSize } from 'state/window/hooks'

const LogoHeader = styled(ItemHeader)`
  flex: 1 0 auto;
  letter-spacing: 0;
  text-decoration: none;
`
type DynamicHeaderLogoProps = TextProps & ItemHeaderProps
export default function DynamicHeaderLogo(props: DynamicHeaderLogoProps) {
  const size = useGetWindowSize()

  const constructedLogo = useMemo(() => {
    if (!size?.width) return null

    if (size.width < MEDIA_WIDTHS.upToExtraSmall) {
      return 'PSTL'
      // size.width < 960px
    }
    // size.width < 720px
    else if (size.width < MEDIA_WIDTHS.upToSmall) {
      return 'PASTELLE'
      // size.width < 960px
    } else {
      return 'PASTELLE APPAREL'
    }
  }, [size])

  return <LogoHeader {...props}>{constructedLogo}</LogoHeader>
}
