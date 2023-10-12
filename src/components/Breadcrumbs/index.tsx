import { Row } from '@past3lle/components'
import { OFF_WHITE, setBestTextColour } from '@past3lle/theme'
import { ItemBreadcrumb } from 'pages/common/styleds'
import { NavLinkProps } from 'react-router-dom'
import { BoxProps } from 'rebass'
import styled from 'styled-components/macro'

const BreadcrumbContainer = styled(Row)<{ $color: string }>`
  margin: 0;
  padding: 1rem;

  > a#breadcrumb-link {
    color: ${({ $color }) => setBestTextColour($color)};
  }
`

export function Breadcrumbs({
  breadcrumbs,
  lastCrumb,
  navLinkProps,
  ...rowProps
}: {
  breadcrumbs: string[]
  lastCrumb: string | undefined
  navLinkProps?: NavLinkProps
} & BoxProps) {
  return (
    <BreadcrumbContainer $color={OFF_WHITE} {...rowProps}>
      {breadcrumbs?.filter(Boolean).map((crumb, index) => {
        // No crumb? We are at root
        if (!crumb) return null
        const isLastCrumb = crumb === lastCrumb
        return (
          <ItemBreadcrumb id="breadcrumb-link" key={crumb + '_' + index} color={OFF_WHITE} to="/#" {...navLinkProps}>
            <span>{!isLastCrumb ? crumb : <strong>{crumb}</strong>}</span>
            {!isLastCrumb && <span>{'//'}</span>}
          </ItemBreadcrumb>
        )
      })}
    </BreadcrumbContainer>
  )
}
