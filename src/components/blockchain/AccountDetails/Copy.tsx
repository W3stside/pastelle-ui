import { Trans } from '@lingui/macro'
import { ButtonLink, Row } from '@past3lle/components'
import { useCopyClipboard } from '@past3lle/hooks'
import { useCallback } from 'react'
import { CheckCircle, Copy } from 'react-feather'
import styled from 'styled-components/macro'

export const CopyIcon = styled(ButtonLink)`
  color: ${({ color, theme }) => color || theme.text3};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ color, theme }) => color || theme.text2};
  }
`
const StyledText = styled(Row)`
  margin-left: 0.25rem;
  align-items: center;
`

const Copied = ({ iconSize }: { iconSize?: number }) => (
  <StyledText>
    <CheckCircle size={iconSize ?? '16'} />
    <StyledText>
      <Trans>Copied</Trans>
    </StyledText>
  </StyledText>
)

export const TransactionStatusText = styled(Row)`
  margin-left: 0.25rem;
  font-size: 0.825rem;
  align-items: center;
`

const Icon = ({ iconSize }: { iconSize?: number }) => (
  <StyledText>
    <Copy size={iconSize ?? '16'} />
  </StyledText>
)

interface BaseProps {
  toCopy: string
  color?: string
  iconSize?: number
  iconPosition?: 'left' | 'right'
}
export type CopyHelperProps = BaseProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

export default function CopyHelper({ color, toCopy, children, iconSize, iconPosition }: CopyHelperProps) {
  const [isCopied, setCopied] = useCopyClipboard()
  const copy = useCallback(() => {
    setCopied(toCopy)
  }, [toCopy, setCopied])

  return (
    <CopyIcon onClick={copy} color={color}>
      {iconPosition === 'left' ? isCopied ? <Copied iconSize={iconSize} /> : <Icon iconSize={iconSize} /> : null}
      {iconPosition === 'left' && <>&nbsp;</>}
      {isCopied ? '' : children}
      {iconPosition === 'right' && <>&nbsp;</>}
      {iconPosition === 'right' ? isCopied ? <Copied iconSize={iconSize} /> : <Icon iconSize={iconSize} /> : null}
    </CopyIcon>
  )
}
