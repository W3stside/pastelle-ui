import { SmartImg } from '@past3lle/components'
import { isMobile } from '@past3lle/utils'
import { SINGLE_ITEM_LOGO_RATIO } from 'constants/config'
import { ShopImageSrcSet } from 'types'

import { ProductLogo, ProductLogoCollectionView, ProductLogoCssImport } from '../styleds'

type LogoParams = {
  parentNode: HTMLElement | null
  logos: { header?: ShopImageSrcSet; nav?: ShopImageSrcSet; main?: ShopImageSrcSet }
  isCollectionView: boolean
}
export default function Logo({ isCollectionView, logos, parentNode }: LogoParams) {
  const collectionLogo = logos.nav || logos.header

  if (isCollectionView && collectionLogo) {
    return <ProductLogoCollectionView collectionView logoUri={collectionLogo} $bgColor="ghostwhite" />
  } else if (parentNode?.clientWidth && logos.main) {
    return !isMobile ? (
      <ProductLogo>
        <SmartImg
          path={{ defaultPath: logos.main.defaultUrl }}
          pathSrcSet={logos.main}
          lazy={false}
          lqImageOptions={{
            width: parentNode?.clientWidth || 0,
            get height() {
              return (this.width * SINGLE_ITEM_LOGO_RATIO[0]) / SINGLE_ITEM_LOGO_RATIO[1]
            },
            showLoadingIndicator: false,
          }}
        />
      </ProductLogo>
    ) : (
      <ProductLogoCssImport logoUri={logos.main} height={parentNode.clientWidth / 3.64} position="relative" />
    )
  } else {
    return null
  }
}
