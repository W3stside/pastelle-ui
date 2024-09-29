import { ShopImageSrcSet } from '@/types'

const PSTL_404_IMG = 'https://ik.imagekit.io/pastelle/artists-mathieu_sgnA_QA83.jpeg'
export const NOT_FOUND_SET = [
  {
    defaultUrl: PSTL_404_IMG,
    500: { '1x': PSTL_404_IMG + '?tr=pr-true,q-70,w-500' },
    720: { '1x': PSTL_404_IMG + '?tr=pr-true,q-70,w-720' },
    1280: { '1x': PSTL_404_IMG + '?tr=pr-true,q-70,w-1280' },
  } as ShopImageSrcSet,
]
