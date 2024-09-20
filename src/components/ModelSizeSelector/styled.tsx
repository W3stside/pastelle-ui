import { Row } from '@past3lle/components'
import { ProductSubHeader } from '@/pages/common/styleds'
import styled from 'styled-components/macro'

export const ModelSizeSelectorWrapper = styled(Row)`
  position: relative;
  flex-flow: row wrap;
  width: 100%;
  gap: 0.7rem;
  margin-bottom: 0;
  justify-content: space-between;

  > div {
    position: relative;
    flex: 1 1 21.8rem;
    min-width: 15.5rem;

    > ${ProductSubHeader} {
      position: absolute;
      width: min-content;
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 1.2rem;
    }

    > ${Row} {
      height: 5rem;

      > select {
        color: ${({ theme }) => theme.content.text};
        border: 1px solid ${({ theme }) => theme.input.border.colour};
        border-radius: 1rem;
        font-size: 1.5rem;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0.8rem 0 0.8rem 0;
        padding-left: calc(50% - 1.6rem);
        font-weight: 700;
        outline: none;
        font-style: italic;

        &:hover {
          background: ${({ theme }) => theme.input.hoverColour};
        }

        transition: background 0.2s ease-in-out;
      }
      > svg {
        cursor: pointer;
        width: 2rem;
        height: 100%;
        margin-left: -3rem;
      }
    }
  }
`
