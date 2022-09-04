import { CURRENT_DROP } from 'constants/config'

type ItemUrlProps = { drop?: string | number; identifier: string }
export function buildItemUrl({ drop = CURRENT_DROP, identifier }: ItemUrlProps) {
  // TODO: reenable itemKey
  return `/drop-${drop}/${identifier}`
}
