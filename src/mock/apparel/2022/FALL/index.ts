import { ItemMetadata, SocialType } from 'mock/apparel/types'

const HOME_GROWN_MESSAGE = 'Home grown in LX @ pastelle labs'

// ================================================================================
// ====================> VIRGIL: CONTENT
// ================================================================================
export const VIRGIL: ItemMetadata = {
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
  social: [{ type: SocialType.INSTAGRAM, url: 'https://instagram.com/mathieusato', display: '@mathieusato' }]
}

// ================================================================================
// ====================> VOODOO: CONTENT
// ================================================================================
export const VOODOO: ItemMetadata = {
  name: 'VOODOO',
  color: '#8f55e999',
  season: 'FALL',
  year: 2022,
  description: [`1500uG +`, `Phasing in and out. Fractals.`, HOME_GROWN_MESSAGE]
}

// ================================================================================
// ====================> ELLEX: CONTENT
// ================================================================================
export const ELLEX: ItemMetadata = {
  name: 'ELLEX',
  color: '#dbbbb9',
  season: 'FALL',
  year: 2022,
  description: [`LADY ESTRELA.`, HOME_GROWN_MESSAGE]
}

// ================================================================================
// ====================> REBIRTH: CONTENT
// ================================================================================
export const REBIRTH: ItemMetadata = {
  name: 'REBIRTH',
  color: '#2c2c2c',
  season: 'FALL',
  year: 2022,
  description: [`REBIRTH.`, '...', HOME_GROWN_MESSAGE]
}

// ================================================================================
// ====================> REBIRTH: CONTENT
// ================================================================================
export const DAYDREAMING: ItemMetadata = {
  name: 'DAYDREAMING',
  color: '#7B649F',
  season: 'FALL',
  year: 2022,
  description: [`DAYDREAM.`, 'I WAS ASLEEP UNDER THE FLOWERS.', `FOR A COUPLE OF HOURS...`],
  collaborator: 'EGON SCHIELE',
  social: [{ type: SocialType.INSTAGRAM, url: 'https://www.wikiart.org/en/egon-schiele', display: 'EGON SCHIELE WIKI' }]
}
