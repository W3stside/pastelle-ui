import { nanoid } from '@reduxjs/toolkit'

import { BASE_MARKDOWN_PATH } from 'components/Markdown/constants'
import { AsideWithScrollableImages } from 'pages/SingleItem/AsideWithScrollableImages'

import { ScrollingContentPage } from 'components/ScrollingContentPage'
import { ArticleFadeInContainer } from 'components/Layout/Article'

// assets
const david = 'david_Je_k19QVb.jpeg'
const felix_david = 'david_felix_tram_QHJOzTJi8.jpg'
const artists = 'artists-mathieu_sgnA_QA83.jpeg'

function _buildMarkdownPath(subfolder: string, fileName: string) {
  return BASE_MARKDOWN_PATH + subfolder + fileName
}
const SUB_FOLDER = 'AboutUs/'

const ABOUT_US_CONTENT = [
  // general about section
  {
    header: 'ABOUT US',
    markdown: _buildMarkdownPath(SUB_FOLDER, 'AboutUs.md'),
    image: { path: felix_david },
    key: nanoid()
  },
  // pillars
  {
    header: 'PILLARS',
    markdown: _buildMarkdownPath(SUB_FOLDER, 'Pillars.md'),
    image: { path: david },
    key: nanoid()
  },
  // artists
  {
    header: 'ARTISTS',
    markdown: _buildMarkdownPath(SUB_FOLDER, 'Artists.md'),
    image: { path: artists },
    key: nanoid()
  }
]

export default function AboutUs() {
  return (
    <ArticleFadeInContainer id="ABOUTUS-ARTICLE">
      <ScrollingContentPage
        data={ABOUT_US_CONTENT}
        dataItem={ABOUT_US_CONTENT[0]}
        IterableComponent={AsideWithScrollableImages}
        baseContentMessage="MORE CONTENT"
        width={`60vw`}
      />
    </ArticleFadeInContainer>
  )
}
