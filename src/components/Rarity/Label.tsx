import { ExternalLink } from '@past3lle/components'
import { Text as TYPE } from 'components/Text'
import { BoxProps } from 'rebass'

interface RarityLabelProps {
  styleProps?: BoxProps
  buttonLabel: string
  // TODO: fix
  metadata: Record<string, any>
}
const SKILLS_URI = 'https://skills.pastelle.shop/#/'
export function RarityLabel({ buttonLabel, metadata, styleProps }: RarityLabelProps) {
  const url = `${SKILLS_URI}?skillId=${metadata?.properties.id}`
  return (
    <TYPE.ProductText display="flex" alignItems={'center'} style={{ gap: '0.5rem', cursor: 'pointer' }} {...styleProps}>
      <ExternalLink href={url} style={{ textDecoration: 'none', color: 'inherit' }}>
        {buttonLabel}
      </ExternalLink>
    </TYPE.ProductText>
  )
}
