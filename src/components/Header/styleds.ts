import styled from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'

const activeClassName = 'ACTIVE'

export const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: ${({ theme }) => theme.buttons.font.size.normal};
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: ${({ theme }) => theme.buttons.borderRadius};
    font-weight: 800;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`
