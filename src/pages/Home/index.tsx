import { useIsMobile } from '@past3lle/hooks'
import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import SEO from 'components/SEO'
import { COLLECTION_PATHNAME } from 'constants/navigation'
import { SingleAsidePage } from 'pages/common'
import { useGetCommonPropsFromProduct } from 'pages/common/hooks/useGetCommonPropsFromProduct'
import { useProductWebCarouselActions } from 'pages/common/hooks/useProductCarouselActions'
import { BaseProductPageProps } from 'pages/common/types'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FragmentProductImageFragment, FragmentProductVideoFragment } from 'shopify/graphql/types'
import { useCurrentCollection } from 'state/collection/hooks'
import { useThemeManager } from 'state/user/hooks'

import * as Screens from '../common/screens'

const LOGO = 'https://pastelle.shop/static/media/pastelle-ivory-outlined.06d3dadfc9e4e7c2c8904b880bf4067c.svg'

const baseProduct: Omit<
  BaseProductPageProps,
  'id' | 'images' | 'videos' | 'headerLogo' | 'navLogo' | 'logo' | 'skillMetadata'
> = {
  altColor: 'darkslateblue',
  bgColor: 'darkslateblue',
  color: '#626a42',
  title: 'PASTELLE',
  handle: 'pastelle',
  productType: 'string',
  //   logo: undefined,
  //   headerLogo: undefined,
  //   navLogo: undefined,
  //   images: [],
  lockedImages: [],
  sizeChart: [],
  //   videos: [],
  sizes: [],
  description: `
    <div>
        <div>
            <h1><strong>PASTELLE</strong></h1>
            <p>HEAVY. ORGANIC. STREETWEAR. PORTUGAL.</p>
            <p>
                PASTELLE APPAREL IS BASED IN LISBOA - 
                THE CAPITAL OF PORTUGAL AND A GROWING HUB OF CREATIVE INDIVIDUALS WHOM SHARE A PASSION FOR EXPRESSION
                WITHOUT SACRIFICING GENUINITY. 
            </p>    
            <p>    
                CAN THERE BE SUSTAINED CREATIVE EXPRESSION 
                WITHOUT GREED AND WASTE? LET'S FIND OUT TOGETHER.
            </p>
            <p>
                HEAVY 250g+ STREETWEAR PIECES PRODUCED FROM ORGANIC MATERIALS WITH A LOW FOOTPRINT.
            </p>

            <p>
                PASTELLE APPAREL IS BASED IN LISBOA - 
                THE CAPITAL OF PORTUGAL AND A GROWING HUB OF CREATIVE INDIVIDUALS WHOM SHARE A PASSION FOR EXPRESSION
                WITHOUT SACRIFICING GENUINITY. 
            </p>    
            <p>    
                CAN THERE BE SUSTAINED CREATIVE EXPRESSION 
                WITHOUT GREED AND WASTE? LET'S FIND OUT TOGETHER.
            </p>
            <p>
                HEAVY 250g+ STREETWEAR PIECES PRODUCED FROM ORGANIC MATERIALS WITH A LOW FOOTPRINT.
            </p>

            <p>
                PASTELLE APPAREL IS BASED IN LISBOA - 
                THE CAPITAL OF PORTUGAL AND A GROWING HUB OF CREATIVE INDIVIDUALS WHOM SHARE A PASSION FOR EXPRESSION
                WITHOUT SACRIFICING GENUINITY. 
            </p>    
            <p>    
                CAN THERE BE SUSTAINED CREATIVE EXPRESSION 
                WITHOUT GREED AND WASTE? LET'S FIND OUT TOGETHER.
            </p>
            <p>
                HEAVY 250g+ STREETWEAR PIECES PRODUCED FROM ORGANIC MATERIALS WITH A LOW FOOTPRINT.
            </p>
        </div>
    </div>
  `,
  artistInfo: undefined,
  shortDescription: 'HEAVY.ORGANIC. STREETWEAR.PORTUGAL',
  noVideo: false,
  noDescription: false,
}
export default function Home() {
  const { collection } = useCurrentCollection()

  const navigate = useNavigate()

  const { mode } = useThemeManager()
  const { onChange } = useProductWebCarouselActions({
    startIndex: 0,
  })
  const product = useMemo(
    () =>
      Object.assign(
        {
          id: collection?.products?.['voodoo']?.id as string,
          skillMetadata: collection?.products?.['voodoo']?.skillMetadata,
          headerLogo: collection?.products?.['voodoo']?.headerLogo,
          navLogo: collection?.products?.['voodoo']?.navLogo,
          logo: urlToSimpleGenericImageSrcSet(LOGO),
          images: (collection?.products?.['voodoo']?.images || []) as FragmentProductImageFragment[],
          videos: (collection?.products?.['voodoo']?.videos || []) as FragmentProductVideoFragment[],
        },
        baseProduct
      ),
    [collection?.products]
  )

  const isMobile = useIsMobile()
  // Get common props for screens
  // lockStatus === null means ignore skill state
  const commonProps = useGetCommonPropsFromProduct({ ...product, variant: null, isMobile, lockStatus: null })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigateToCollection = useCallback(() => navigate(COLLECTION_PATHNAME), [])

  if (!product.videos.length || !product.images.length) return null

  return (
    <>
      <SEO title="HEAVY STREETWEAR" name="HEAVY STREETWEAR" description="PASTELLE. HEAVY STREETWEAR. PORTUGAL." />
      <SingleAsidePage bgColor={product.bgColor} logo={product.logo} altLogo={product.navLogo}>
        {({ rootContainerNode, screensContainerNode }) => (
          <>
            <Screens.AsideCarousel
              {...commonProps}
              containerNode={screensContainerNode}
              carousel={{
                images: product.images,
                lockedImages: product.lockedImages,
                videos: product.videos,
                startIndex: 0,
                onChange,
                onCarouselItemClick: alert,
              }}
              themeMode={mode}
              breadcrumbs={{
                breadcrumbs: ['Home'],
                lastCrumb: 'Home',
              }}
              skillInfo={null}
              userAddress={undefined}
            />
            <Screens.ActionScreen
              {...commonProps}
              labels={{
                main: 'VIEW COLLECTION',
                async: 'HEADING TO COLLECTION',
              }}
              skillInfo={null}
              callback={navigateToCollection}
              fixedWidth={screensContainerNode?.clientWidth}
              rootNode={rootContainerNode}
            />
            <Screens.Description
              {...commonProps}
              containerNode={screensContainerNode}
              description={product.description}
            />
          </>
        )}
      </SingleAsidePage>
    </>
  )
}
