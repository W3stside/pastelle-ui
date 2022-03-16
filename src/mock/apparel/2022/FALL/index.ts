import { ItemMediaContent, ItemMetadata, SocialType } from 'mock/apparel/types'
import { buildItemParams } from 'mock/apparel/utils'

// ================================================================================
// ====================> VIRGIL: CONTENT
// ================================================================================
const VIRGIL_PARAMS: ItemMetadata = {
  name: 'VIRGIL',
  // color: '#a2c2fa', // LIGHTER
  color: '#427da2',
  season: 'FALL',
  year: 2022,
  description: [
    `“And I — my head oppressed by horror — said: "Master, what is it that I hear? Who are those people so defeated by
      their pain?"`,
    `And he to me: "This miserable way is taken by the sorry souls of those who lived without disgrace and without
      praise. They now commingle with the coward angels, the company of those who were not rebels nor faithful to their
      God, but stood apart. The heavens, that their beauty not be lessened, have cast them out, nor will deep Hell
      receive them — even the wicked cannot glory in them.”`
  ],
  collaborator: 'Mathieu Sato',
  social: [{ type: SocialType.INSTAGRAM, url: 'https://instagram.com/mathieusato', display: '@mathieusato' }]
}

const VIRGIL_MEDIA: ItemMediaContent = {
  logo: 'logo__cCch4BKNb8.png',
  images: {
    front: 'front-large_Z9l3Rr7SR.png',
    back: 'back-large_DSW6FgIcg.png'
  },
  videos: {
    front: 'front_qNOpNgd2z.webm',
    back: 'back_W76cqDjaR.webm'
  }
}

export const VIRGIL = buildItemParams(VIRGIL_PARAMS, VIRGIL_MEDIA)

// ================================================================================
// ====================> VOODOO: CONTENT
// ================================================================================
const VOODOO_PARAMS: ItemMetadata = {
  name: 'VOODOO',
  color: '#8f55e999',
  season: 'FALL',
  year: 2022,
  description: [`1500uG +`, `Phasing in and out. Fractals.`, `Home grown in LX @ pastelle labs`]
}

const VOODOO_MEDIA: ItemMediaContent = {
  logo: 'logo_So9mIc7n7.png',
  images: {
    front: 'front-large_3AJd4v3s-mU.png',
    back: 'back-large_kT9xjz8Jk.png'
  },
  videos: {
    front: 'front_qNOpNgd2z.webm',
    back: 'back_W76cqDjaR.webm'
  }
}

export const VOODOO = buildItemParams(VOODOO_PARAMS, VOODOO_MEDIA)

// ================================================================================
// ====================> ELLEX: CONTENT
// ================================================================================
const ELLEX_PARAMS: ItemMetadata = {
  name: 'ELLEX',
  color: '#dbbbb9',
  season: 'FALL',
  year: 2022,
  description: [`LADY ESTRELA.`, `Home grown in LX @ pastelle labs`]
}

const ELLEX_MEDIA: ItemMediaContent = {
  images: {
    front: 'front-large_Cms4yOswP.png',
    back: 'back-large_664zvVTRG.png'
  },
  videos: {
    front: 'front_qNOpNgd2z.webm',
    back: 'back_W76cqDjaR.webm'
  }
}

export const ELLEX = buildItemParams(ELLEX_PARAMS, ELLEX_MEDIA)

// ================================================================================
// ====================> REBIRTH: CONTENT
// ================================================================================
const REBIRTH_PARAMS: ItemMetadata = {
  name: 'REBIRTH',
  color: '#2c2c2c',
  season: 'FALL',
  year: 2022,
  description: [`REBIRTH.`, '...', `Home grown in LX @ pastelle labs`]
}

const REBIRTH_MEDIA: ItemMediaContent = {
  images: {
    front: 'front-large_Xp_n4aZ6fdS.png',
    back: 'back-large_u9WOujqHc.png'
  },
  videos: {
    front: 'front_qNOpNgd2z.webm',
    back: 'back_W76cqDjaR.webm'
  }
}

export const REBIRTH = buildItemParams(REBIRTH_PARAMS, REBIRTH_MEDIA)
