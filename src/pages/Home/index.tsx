import { SEO_DICT } from 'analytics/seo'
import { ArticleFadeInContainer } from 'components/Layout'
import SEO from 'components/SEO'
import { COLLECTION_PATHNAME } from 'constants/navigation'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => navigate(COLLECTION_PATHNAME), 0)
  }, [navigate])

  return (
    <>
      <SEO title={SEO_DICT.home.title} name={SEO_DICT.home.title} description={SEO_DICT.home.description} />
      <ArticleFadeInContainer id="COLLECTION-ARTICLE">
        <h1>PASTELLE APPAREL: {SEO_DICT.home.description}</h1>
      </ArticleFadeInContainer>
    </>
  )
}
