import { Row } from 'components/Layout'
import { ItemBreadcrumb } from 'pages/SingleItem/styleds'
import { BoxProps } from 'rebass'

export function Breadcrumbs({
  color,
  breadcrumbs,
  lastCrumb,
  ...rowProps
}: {
  color: string
  breadcrumbs: string[]
  lastCrumb: string | undefined
} & BoxProps) {
  return (
    <Row {...rowProps} margin="0.8rem" style={{ position: 'absolute', top: 0, left: 0, zIndex: 100 }}>
      {breadcrumbs?.map((crumb, index) => {
        if (!crumb) return null
        const isLastCrumb = crumb === lastCrumb
        return (
          <ItemBreadcrumb key={crumb + '_' + index} color={color} to="/#">
            <span>{!isLastCrumb ? crumb : <strong>{crumb}</strong>}</span>
            {!isLastCrumb && <span>{'//'}</span>}
          </ItemBreadcrumb>
        )
      })}
    </Row>
  )
}
