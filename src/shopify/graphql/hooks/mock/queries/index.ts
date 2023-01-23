// VIRGIL media
import virgilBackFS from '../assets/virgil-back.jpg'
import virgilFrontFS from '../assets/virgil-front.jpg'
import virgilHeader from '../assets/virgil-header.png'
import virgilLogo from '../assets/virgil-logo.png'
import virgilNav from '../assets/virgil-nav.png'
import virgilShowcaseBack from '../assets/virgil-showcase-back.mp4'
import virgilShowcaseFront from '../assets/virgil-showcase-front.mp4'

export const MOCK_COLLECTION_DATA = {
  __typename: 'QueryRoot',
  collections: {
    __typename: 'CollectionConnection',
    nodes: [
      {
        __typename: 'Collection',
        id: 'gid://collection-genesi$-mock',
        title: 'MOCK GENESI$',
        handle: 'MOCK GENESI$',
        image: { __typename: 'Image', url: '' },
        products: {
          __typename: 'ProductConnection',
          nodes: [
            {
              __typename: 'Product',
              id: 'gid://virgil-product-mock-1',
              title: 'VIRGIL',
              handle: 'virgil-longsleeve',
              updatedAt: new Date().toISOString(),
              description: 'Longsleeve beast king',
              descriptionHtml: `
                <div>
                    <h1>VIRGIL</h1>
                    <p>DARKNESS REIGNS MFER</p>
                    <ul>
                        <li>WASH INSIDE OUT</li>
                        <li>WASH COLD</li>
                    </ul>
                </div>
              `,
              images: {
                __typename: 'ImageConnection',
                nodes: [
                  {
                    __typename: 'Image',
                    id: 'gid://virgil-image-mock-1',
                    url: virgilFrontFS,
                    altText: 'virgil image 1',
                    width: 2000,
                    height: 2000,
                    url125: '',
                    url250: '',
                    url500: '',
                    url720: '',
                    url960: '',
                    url1280: ''
                  },
                  {
                    __typename: 'Image',
                    id: 'gid://virgil-image-mock-2',
                    url: virgilBackFS,
                    altText: 'virgil image 2',
                    width: 2000,
                    height: 2000,
                    url125: '',
                    url250: '',
                    url500: '',
                    url720: '',
                    url960: '',
                    url1280: ''
                  }
                ]
              },
              media: {
                __typename: 'MediaConnection',
                nodes: [
                  {
                    __typename: 'Video',
                    id: 'gid://virgil-video-mock-1',
                    mediaContentType: 'VIDEO',
                    previewImage: {
                      __typename: 'Image',
                      url: virgilShowcaseFront,
                      width: 1600,
                      height: 900
                    },
                    sources: [{ __typename: 'VideoSource', mimeType: 'video/mp4', url: virgilShowcaseFront }]
                  },
                  {
                    __typename: 'Video',
                    id: 'gid://virgil-video-mock-2',
                    mediaContentType: 'VIDEO',
                    previewImage: {
                      __typename: 'Image',
                      url: virgilShowcaseBack,
                      width: 1600,
                      height: 900
                    },
                    sources: [{ __typename: 'VideoSource', mimeType: 'video/mp4', url: virgilShowcaseBack }]
                  }
                ]
              },
              sizes: [{ __typename: 'ProductOption', values: ['S', 'M', 'L', 'XL'] }],
              featuredImage: { __typename: 'Image', url: '', width: 2000, height: 2000 },
              options: [{ __typename: 'ProductOption', name: 'Sizes', values: ['S', 'M', 'L', 'XL'] }],
              brandingAssetMap: {
                __typename: 'Metafield',
                value: { logo: virgilLogo, navLogo: virgilNav, headerLogo: virgilHeader }
              },
              bgColor: { __typename: 'Metafield', value: '#1f605c' },
              color: { __typename: 'Metafield', value: '#551d27' },
              artistInfo: {
                __typename: 'Metafield',
                value: JSON.stringify({
                  social: 'instagram',
                  handle: '@mathieusato'
                })
              }
            }
          ]
        }
      }
    ]
  }
}
