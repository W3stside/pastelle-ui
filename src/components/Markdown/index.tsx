import ReactMarkdownHtml from 'react-markdown/with-html'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'

import { HeadingRenderer } from './renderers'
import useFetchFile from 'hooks/useFetchFile'
import { LinkScrollable, Link } from 'components/Link'

interface MarkdownParams {
  contentFile: string
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

export function MarkdownRenderer({ contentFile }: MarkdownParams) {
  const { error, file } = useFetchFile(contentFile)
  return (
    <>
      {file && <MarkdownContent>{file}</MarkdownContent>}
      {error && <MarkdownContent>{error}</MarkdownContent>}
    </>
  )
}
