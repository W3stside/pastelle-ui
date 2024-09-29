import { useStateRef } from '@past3lle/hooks'
import { useCallback, useMemo } from 'react'
import { Logo, LogoProps } from './Logo'

export function useLogo(props: Omit<LogoProps, 'parentNode'>) {
  const [node, setNodeRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)

  return {
    Logo: useCallback(
      () => (props?.logoSrcSet || props?.src ? <Logo parentNode={node} {...props} /> : null),
      [node, props],
    ),
    ref: useMemo(
      () => ({
        setRef: setNodeRef,
        ref: node,
      }),
      [node, setNodeRef],
    ),
  }
}
