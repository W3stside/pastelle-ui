import { BoxProps } from 'rebass'
import styled from 'styled-components/macro'
import { Row } from 'components/Layout'
import { ItemBreadcrumb } from 'pages/common/styleds'
import { BLACK_TRANSPARENT, OFF_WHITE } from 'theme/utils'
import { NavLinkProps } from 'react-router-dom'
import { isMobile } from 'utils'

const BreadcrumbContainer = styled(Row)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background: ${isMobile ? BLACK_TRANSPARENT : `linear-gradient(75deg, ${BLACK_TRANSPARENT} 33%, transparent)`};
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
