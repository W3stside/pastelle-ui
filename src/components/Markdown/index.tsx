import ReactMarkdownHtml from 'react-markdown/with-html'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'

import { HeadingRenderer } from './renderers'
import useFetchFile from 'hooks/useFetchFile'
import { LinkScrollable, Link } from 'components/Link'
import { FixedAnimatedLoader } from 'components/Loader'

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
    renderers={{ heading: HeadingRenderer, link: LinkScrollable }} /* allowDangerousHtml */
  />
)

export function MarkdownRenderer({ filePath }: MarkdownParams) {
  const { error, loading, file } = useFetchFile(filePath)

  if (loading) return <FixedAnimatedLoader loadText="PASTL" />

  return (
    <>
      {file && <MarkdownContent>{file}</MarkdownContent>}
      {error && <MarkdownContent>{error}</MarkdownContent>}
    </>
  )
}
