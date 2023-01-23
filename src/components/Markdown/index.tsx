import { Link, ScrollableLink } from '@past3lle/components'
import { FixedAnimatedLoader } from 'components/Loader'
import useFetchFile from 'hooks/useFetchFile'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import ReactMarkdownHtml from 'react-markdown/with-html'

import { HeadingRenderer } from './renderers'

interface MarkdownParams {
  filePath: string
}

export function Markdown(props: { children?: string }) {
  const { children = '' } = props
  return <ReactMarkdown renderers={{ link: Link }}>{children}</ReactMarkdown>
}

const MarkdownContent = (props: ReactMarkdownProps & { children: string }) => (
  <ReactMarkdownHtml
    {...props}
    renderers={{ heading: HeadingRenderer, link: ScrollableLink }} /* allowDangerousHtml */
  />
)

export function MarkdownRenderer({ filePath }: MarkdownParams) {
  const { error, loading, file } = useFetchFile(filePath)

  if (loading) return <FixedAnimatedLoader loadingComponent="PSTL" />

  return (
    <>
      {file && <MarkdownContent>{file}</MarkdownContent>}
      {error && <MarkdownContent>{error}</MarkdownContent>}
    </>
  )
}
