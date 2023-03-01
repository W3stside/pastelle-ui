import { ExternalLink } from '@past3lle/components'
import { Text as TYPE } from 'components/Text'
import { BoxProps } from 'rebass'

interface RarityLabelProps {
  styleProps?: BoxProps
  buttonLabel: string
  href: string
}
export function RarityLabel({ buttonLabel, href, styleProps }: RarityLabelProps) {
  return (
    <TYPE.ProductText display="flex" alignItems={'center'} style={{ gap: '0.5rem', cursor: 'pointer' }} {...styleProps}>
      <ExternalLink href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
        {buttonLabel}
      </ExternalLink>
    </TYPE.ProductText>
  )
}
