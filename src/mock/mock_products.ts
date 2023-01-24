import { ItemMetaDataOptions, ItemMetadata, SocialType } from 'mock/types'

type CustomItemMetaData = ItemMetadata & ItemMetaDataOptions

const HOME_GROWN_MESSAGE = 'Home grown in LX @ pastelle labs'

// ================================================================================
// ====================> VIRGIL: CONTENT
// ================================================================================
export const VIRGIL: CustomItemMetaData = {
  name: 'VIRGIL',
  // color: '#a2c2fa', // LIGHTER
  // color: '#427da2', // blue
  color: '#551d27', // red
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
  social: [{ type: SocialType.INSTAGRAM, url: 'https://instagram.com/mathieusato', display: '@mathieusato' }],
  imageExtension: 'jpg'
}

// ================================================================================
// ====================> VOODOO: CONTENT
// ================================================================================
export const VOODOO: CustomItemMetaData = {
  name: 'VOODOO',
  color: '#26297a',
  season: 'FALL',
  year: 2022,
  description: [`1500uG +`, `Phasing in and out. Fractals.`, HOME_GROWN_MESSAGE],
  reverseMediaOrder: true
}

// ================================================================================
// ====================> ELLEX: CONTENT
// ================================================================================
export const ELLEX: CustomItemMetaData = {
  name: 'ELLEX',
  color: '#dbbbb9',
  season: 'FALL',
  year: 2022,
  description: [`LADY ESTRELA.`, HOME_GROWN_MESSAGE],
  reverseMediaOrder: true
}

// ================================================================================
// ====================> REBIRTH: CONTENT
// ================================================================================
export const REBIRTH: CustomItemMetaData = {
  name: 'REBIRTH',
  color: '#2c2c2c',
  season: 'FALL',
  year: 2022,
  description: [`REBIRTH.`, '...', HOME_GROWN_MESSAGE]
}

// ================================================================================
// ====================> DAYDREAMING: CONTENT
// ================================================================================
export const DAYDREAMING: CustomItemMetaData = {
  name: 'DAYDREAMING',
  color: '#7B649F',
  season: 'FALL',
  year: 2022,
  description: [`DAYDREAM.`, 'I WAS ASLEEP UNDER THE FLOWERS.', `FOR A COUPLE OF HOURS...`],
  collaborator: 'EGON SCHIELE',
  social: [
    { type: SocialType.INSTAGRAM, url: 'https://www.wikiart.org/en/egon-schiele', display: 'EGON SCHIELE WIKI' }
  ],
  reverseMediaOrder: true,
  imageExtension: 'jpg'
}

// ================================================================================
// ====================> ASCENDANCE: CONTENT
// ================================================================================
export const ASCENDANCE: CustomItemMetaData = {
  name: 'ASCENDANCE',
  color: '#749a96',
  season: 'FALL',
  year: 2022,
  description: [`DIE.`, 'ASCEND.', `BECOME.`],
  reverseMediaOrder: true,
  imageExtension: 'jpg'
}
