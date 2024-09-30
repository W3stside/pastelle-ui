import { Row, RowProps } from '@past3lle/components'
import { setBestTextColour, BLACK, upToExtraSmall, transparentize } from '@past3lle/theme'
import styled from 'styled-components'
import { SizeSelectorProps } from './types'
import { Text } from '@/components/Text'

export const SquareSelectDiv = styled(Text.Black)<{ isSelected: boolean; bgColor?: string | null }>`
  ${({ isSelected, theme, bgColor }) =>
    isSelected &&
    `
      &&&&& {
        filter: hue-rotate(180deg) saturate(1.5);
        background-color: ${bgColor || theme.content.text};
        color: ${setBestTextColour(bgColor || theme.content.text, 2, true)};
        font-weight: 800;
        text-shadow: 0px 0px 3px ${transparentize(0.6, BLACK)};
      }
    `}
`
export const GridSelect = styled(Row)<RowProps & Pick<SizeSelectorProps, 'color'>>`
  gap: 0.5rem;
  flex-flow: row wrap;

  border-radius: ${({ theme }) => theme.button.border.radius};
  border: 1px solid ${({ theme }) => theme.input.border.colour};
  overflow: hidden;

  width: 100%;

  > ${SquareSelectDiv} {
    background: ${({ color }) => color};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 1rem 2rem;
    text-align: center;
    font-size: 2rem;
    font-weight: 400;
    color: ${({ theme, color }) => setBestTextColour(color || theme.content.text, 2, true)};
    height: 7rem;
    flex: 1 1 24%;

    ${upToExtraSmall`
      flex: 1 1 50%;
    `}

    &:hover {
      filter: hue-rotate(180deg);
    }

    transition: filter 0.3s ease-out;
  }
`
