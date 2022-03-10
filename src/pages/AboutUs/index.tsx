import { nanoid } from '@reduxjs/toolkit'

import { BASE_MARKDOWN_PATH } from 'components/Markdown/constants'
import { AsideWithScrollableImages } from 'pages/SingleItem/AsideWithScrollableImages'

// assets
import david from 'assets/images/aboutus/david.jpeg'
import felix_david from 'assets/images/aboutus/felix_david_train_cropped.jpg'
import artists from 'assets/images/aboutus/artists-mathieu.jpeg'
import { ScrollingContentPage } from 'components/ScrollingContentPage'

function _buildMarkdownPath(subfolder: string, fileName: string) {
  return BASE_MARKDOWN_PATH + subfolder + fileName
}
const SUB_FOLDER = 'AboutUs/'

const ABOUT_US_CONTENT = [
  // general about section
  {
    header: 'ABOUT US',
    markdown: _buildMarkdownPath(SUB_FOLDER, 'AboutUs.md'),
    image: felix_david,
    key: nanoid()
  },
  // pillars
  {
    header: 'PILLARS',
    markdown: _buildMarkdownPath(SUB_FOLDER, 'Pillars.md'),
    image: david,
    key: nanoid()
  },
  // artists
  {
    header: 'ARTISTS',
    markdown: _buildMarkdownPath(SUB_FOLDER, 'Artists.md'),
    image: artists,
    key: nanoid()
  }
]

export default function AboutUs() {
  return (
    <ScrollingContentPage
      data={ABOUT_US_CONTENT}
      dataItem={ABOUT_US_CONTENT[0]}
      IterableComponent={AsideWithScrollableImages}
      baseContentMessage="MORE CONTENT"
      width="calc(100% - 637px)"
    />
  )
}
