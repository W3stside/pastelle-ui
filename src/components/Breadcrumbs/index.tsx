import { Row } from '@past3lle/components'
import { OFF_WHITE, setBestTextColour } from '@past3lle/theme'
import { ItemBreadcrumb } from '@/components/pages-common/styleds'
import { BoxProps } from 'rebass'
import styled from 'styled-components/macro'
import { LinkProps } from 'next/link'

const BreadcrumbContainer = styled(Row)<{ $color: string }>`
  margin: 0;
  padding: 1rem;

  > a#breadcrumb-link {
    color: ${({ $color }) => setBestTextColour($color, ['AAA'], true)};
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
  navLinkProps?: Omit<LinkProps, 'as'>
} & BoxProps) {
  return (
    <BreadcrumbContainer $color={OFF_WHITE} {...rowProps}>
      {breadcrumbs?.filter(Boolean).map((crumb, index) => {
        // No crumb? We are at root
        if (!crumb) return null
        const isLastCrumb = crumb === lastCrumb
        return (
          <ItemBreadcrumb
            id="breadcrumb-link"
            key={crumb + '_' + index}
            color={OFF_WHITE}
            href="/collection"
            {...navLinkProps}
          >
            <span>{!isLastCrumb ? crumb : <strong>{crumb}</strong>}</span>
            {!isLastCrumb && <span>{'//'}</span>}
          </ItemBreadcrumb>
        )
      })}
    </BreadcrumbContainer>
  )
}
