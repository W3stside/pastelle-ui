import { ItemMetadata, SocialType } from 'mock/apparel/types'

// ================================================================================
// ====================> VIRGIL: CONTENT
// ================================================================================
export const VIRGIL: ItemMetadata = {
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

// ================================================================================
// ====================> VOODOO: CONTENT
// ================================================================================
export const VOODOO: ItemMetadata = {
  name: 'VOODOO',
  color: '#8f55e999',
  season: 'FALL',
  year: 2022,
  description: [`1500uG +`, `Phasing in and out. Fractals.`, `Home grown in LX @ pastelle labs`]
}

// ================================================================================
// ====================> ELLEX: CONTENT
// ================================================================================
export const ELLEX: ItemMetadata = {
  name: 'ELLEX',
  color: '#dbbbb9',
  season: 'FALL',
  year: 2022,
  description: [`LADY ESTRELA.`, `Home grown in LX @ pastelle labs`]
}

// ================================================================================
// ====================> REBIRTH: CONTENT
// ================================================================================
export const REBIRTH: ItemMetadata = {
  name: 'REBIRTH',
  color: '#2c2c2c',
  season: 'FALL',
  year: 2022,
  description: [`REBIRTH.`, '...', `Home grown in LX @ pastelle labs`]
}
