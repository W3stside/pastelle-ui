import { ExternalLink } from '@/components/Navigation/styled'
import { Text as TYPE } from '@/components/Text'
import { SkillMetadata } from '@past3lle/forge-web3'
import { BoxProps } from 'rebass'
import { Chain } from 'viem'

interface RarityLabelProps {
  styleProps?: BoxProps
  buttonLabel: string
  metadata: SkillMetadata
  chain?: Chain
}
const SKILLS_URI =
  import.meta.env.NODE_ENV === 'production' ? 'https://skills.pastelle.shop/' : 'http://localhost:6969/'
export function RarityLabel({ buttonLabel, metadata, chain, styleProps }: RarityLabelProps) {
  const url = `${SKILLS_URI}?forge-network=${chain?.id || 'disconnected'}&forge-skill=${metadata?.properties.id}`
  return (
    <TYPE.ProductText display="flex" alignItems={'center'} style={{ gap: '0.5rem', cursor: 'pointer' }} {...styleProps}>
      <ExternalLink href={url} style={{ textDecoration: 'none', color: 'inherit' }}>
        {buttonLabel}
      </ExternalLink>
    </TYPE.ProductText>
  )
}
