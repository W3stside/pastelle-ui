type StaticSeoPageNames = 'home' | 'collection'

type SeoDict = {
  [name in StaticSeoPageNames]: {
    title: string
    description: string
  }
}

export const SEO_DICT: SeoDict = {
  home: {
    title: 'HEAVY STREETWEAR MADE IN PORTUGAL',
    description: 'Organic, high quality heavy streetwear locally made in Portugal.',
  },
  collection: {
    title: 'LATEST COLLECTION',
    description: 'View the latest Pastelle heavy streewear collection, available now!',
  },
}
