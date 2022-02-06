import styled from 'styled-components/macro'
import { AsideWithVideo } from 'pages/SingleItem'
import HOME_ITEMS_LIST from 'mock/apparel'

export const PageArticle = styled.article``

export default function Home() {
  return (
    <PageArticle>
      {HOME_ITEMS_LIST.map(({ key, ...restItemData }) => (
        <AsideWithVideo key={key} {...restItemData} />
      ))}
    </PageArticle>
  )
}
