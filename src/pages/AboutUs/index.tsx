import { nanoid } from '@reduxjs/toolkit'
import { ArticleFadeInContainer } from '@/components/Layout/Article'
import { BASE_MARKDOWN_PATH } from '@/components/Markdown/constants'
import SEO from '@/components/SEO'
import { AsideWithScrollableImages } from '@/components/Asides/skill/AsideWithScrollableImages'

// assets
// const david = 'david_Je_k19QVb.jpeg'
// const felix_david = 'david_felix_tram_QHJOzTJi8.jpg'
// const artists = 'artists-mathieu_sgnA_QA83.jpeg'

function _buildMarkdownPath(subfolder: string, fileName: string) {
  return BASE_MARKDOWN_PATH + subfolder + fileName
}
const SUB_FOLDER = 'AboutUs/'

const ABOUT_US_CONTENT = [
  // general about section
  {
    header: 'ABOUT US',
    markdown: _buildMarkdownPath(SUB_FOLDER, 'AboutUs.md'),
    image: { path: '' },
    key: nanoid(),
  },
  // pillars
  // {
  //   header: 'PILLARS',
  //   markdown: _buildMarkdownPath(SUB_FOLDER, 'Pillars.md'),
  //   image: { path: david },
  //   key: nanoid()
  // },
  // // artists
  // {
  //   header: 'ARTISTS',
  //   markdown: _buildMarkdownPath(SUB_FOLDER, 'Artists.md'),
  //   image: { path: artists },
  //   key: nanoid()
  // }
]

export default function AboutUs() {
  return (
    <>
      <SEO title="ABOUT" name="ABOUT" description="About PASTELLE" />
      <ArticleFadeInContainer id="ABOUTUS-ARTICLE">
        <AsideWithScrollableImages
          markdown={ABOUT_US_CONTENT[0].markdown}
          header="ABOUT US"
          image={ABOUT_US_CONTENT[0].image}
          key={ABOUT_US_CONTENT[0].key}
        />
      </ArticleFadeInContainer>
    </>
  )
}
