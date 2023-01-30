import { Row } from '@past3lle/components'
import { OFF_WHITE } from '@past3lle/theme'
import { ItemBreadcrumb } from 'pages/common/styleds'
import { NavLinkProps } from 'react-router-dom'
import { BoxProps } from 'rebass'
import styled from 'styled-components/macro'

// position: absolute;
// top: 0;
// left: 0;
// z-index: 100;
// background: ${!isMobile && `linear-gradient(75deg, ${BLACK_TRANSPARENT} 33%, transparent)`};
// padding: 1.5rem;
// opacity: 0.5;
const BreadcrumbContainer = styled(Row)`
  margin: 0;
  padding: 1rem;
`

export function Breadcrumbs({
  // color,
  breadcrumbs,
  lastCrumb,
  navLinkProps,
  ...rowProps
}: {
  // color: string
  breadcrumbs: string[]
  lastCrumb: string | undefined
  navLinkProps?: NavLinkProps
} & BoxProps) {
  return (
    <BreadcrumbContainer {...rowProps}>
      {breadcrumbs?.map((crumb, index) => {
        if (!crumb) return null
        const isLastCrumb = crumb === lastCrumb
        return (
          <ItemBreadcrumb key={crumb + '_' + index} color={OFF_WHITE} to="/#" {...navLinkProps}>
            <span>{!isLastCrumb ? crumb : <strong>{crumb}</strong>}</span>
            {!isLastCrumb && <span>{'//'}</span>}
          </ItemBreadcrumb>
        )
      })}
    </BreadcrumbContainer>
  )
}
