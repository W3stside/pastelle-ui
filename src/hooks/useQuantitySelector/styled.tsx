import { Row } from '@past3lle/components'
import { BLACK, setBestTextColour } from '@past3lle/theme'
import styled from 'styled-components'

export const QuantitySelectorWrapper = styled(Row)<{ color?: string | null }>`
  width: 100%;
  min-height: 6rem;

  align-items: stretch;
  justify-content: center;
  padding: 1rem;

  > button {
    &:disabled {
      background: dimgrey;
      cursor: not-allowed;
      color: #000;
    }
    border: none;
    border-radius: 0.1rem;
    margin: 0 0.5rem;
    background-color: ${({ color }) => color || BLACK};
    color: ${({ color }) => setBestTextColour(color || BLACK, 2, true)};
    min-width: 3rem;

    &:first-of-type:not(:disabled) {
      background: none;
      background-color: ${({ theme }) => theme.red3};
    }
  }

  > button,
  > input {
    text-align: center;
    font-weight: 200;
    font-size: 1.6rem;
    outline: none;
  }

  > input {
    font-weight: 400;
    background-color: ${({ theme }) => theme.content.background};
    color: ${({ theme }) => theme.content.text};
  }

  > svg {
    align-self: center;
  }

  > *:not(input[type='number']):not(button:disabled) {
    cursor: pointer;
  }

  #reset-button {
    color: ${({ theme }) => theme.content.text};
    text-decoration: underline;
    cursor: pointer;
    padding: 0.1rem;
    background-color: ${({ theme }) => theme.offwhiteOpaqueMost};
  }
`
