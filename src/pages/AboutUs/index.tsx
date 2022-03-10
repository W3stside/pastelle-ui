import { nanoid } from '@reduxjs/toolkit'

import { BASE_MARKDOWN_PATH } from 'components/Markdown/constants'
import { AsideWithScrollableImages } from 'pages/SingleItem/AsideWithScrollableImages'

// assets
import david from 'assets/images/aboutus/david.jpeg'
import felix_david from 'assets/images/aboutus/felix_david_train_cropped.jpg'
import { ScrollingContentPage } from 'components/ScrollingContentPage'

const FILE_NAME = 'AboutUs.md'
const FILE_PATH = BASE_MARKDOWN_PATH + FILE_NAME

const ABOUT_US_CONTENT = [
  // general about section
  {
    header: 'ABOUT US',
    markdown: FILE_PATH,
    image: felix_david,
    key: nanoid()
  },
  // sustainability
  {
    header: 'SUSTAINABILITY',
    markdown: FILE_PATH,
    image: david,
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
