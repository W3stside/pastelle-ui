import { ExternalLink } from '@past3lle/components'
import { ChainsPartialReadonly } from '@past3lle/forge-web3'
import { Text as TYPE } from 'components/Text'
import { BoxProps } from 'rebass'

interface RarityLabelProps {
  styleProps?: BoxProps
  buttonLabel: string
  // TODO: fix
  metadata: Record<string, any>
  chain?: ChainsPartialReadonly<number>[number]
}
const SKILLS_URI = process.env.NODE_ENV === 'production' ? 'https://skills.pastelle.shop/' : 'http://localhost:6969/'
export function RarityLabel({ buttonLabel, metadata, chain, styleProps }: RarityLabelProps) {
  const url = `${SKILLS_URI}?forge-network=${chain?.network || 'disconnected'}&forge-skill=${metadata?.properties.id}`
  return (
    <TYPE.ProductText display="flex" alignItems={'center'} style={{ gap: '0.5rem', cursor: 'pointer' }} {...styleProps}>
      <ExternalLink href={url} style={{ textDecoration: 'none', color: 'inherit' }}>
        {buttonLabel}
      </ExternalLink>
    </TYPE.ProductText>
  )
}
