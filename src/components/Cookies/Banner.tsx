'use client'

import { CookieBanner } from '@past3lle/components'
import { devDebug } from '@past3lle/utils'
import { initAnalytics } from '@/analytics'
import { useAppColourTheme } from '@/state/user/hooks'
import styled from 'styled-components/macro'
import { transparentize, upToExtraSmall } from '@past3lle/theme'
import { useIsClientReady } from '@/hooks/useIsClientReady'

export default function CookiesBanner() {
  const { mode } = useAppColourTheme()

  const isClientReady = useIsClientReady()

  if (!isClientReady) return null

  return (
    <CookieBannerWrapper>
      <CookieBanner
        css={`
          ${mode === 'DARK' ? `filter: brightness(0.7);` : ''}
          height: 40vh;
          box-shadow: 0px -7px 0px #82ee9d;
          &&&& {
            > * {
              background-color: #cd8acceb;

              > div:first-child {
                > div:first-child {
                  font-variation-settings: 'wght' 300;
                  font-size: 4.5rem;
                }
              }
              > div:nth-child(2) {
                background-color: #ada2e2a6;
                color: ghostwhite;
              }
              >div: nth-child(3) {
                div {
                  input {
                    &:before {
                      box-shadow: inset 1em 1em ${mode === 'DARK' ? '#8b1919' : '#ada2e2'};
                    }
                  }
                }
              }
              > div:last-child {
                background-color: #ada2e2a6;
              }

              > div:nth-child(3),
              > div:last-child {
                > div {
                  color: ghostwhite;
                }
              }
            }
          }
        `}
        storageKey={process.env.NEXT_PUBLIC_PASTELLE_COOKIE_SETTINGS || 'PASTELLE_SHOP_cookies'}
        message={'🍪 COOKIES?'}
        fullText={
          <div>
            <p>PASTELLE APPAREL cookie policy. Please read and make a selection below!</p>
            <p>
              OPT-IN <strong>MARKETING</strong> COOKIES, explained:
            </p>
            <ExplanationWrapper>
              <p>
                1. Send you details on newest collections and items related to what you may have purchased in the past
              </p>
              <br />
              <p>2. See which kind of our merch is preferred and continue delivering similar quality to you</p>
            </ExplanationWrapper>
            <p>Closing the banner will submit the current selected options. By default that is just the essentials.</p>
          </div>
        }
        onAcceptAdvertising={devDebug}
        onSaveAndClose={(cookieState) => {
          devDebug('COOKIE BANNER SAVED AND CLOSED.', cookieState)
          initAnalytics(cookieState)
        }}
      />
    </CookieBannerWrapper>
  )
}

const CookieBannerWrapper = styled.div`
  > div > div {
    > div:first-child > div {
      font-variation-settings: 'wght' 500;
      font-size: 6rem;
      letter-spacing: -6px;
      font-style: normal;
      margin-top: 2rem;
    }
    > div:nth-child(2) {
      ${upToExtraSmall`
        padding: 1rem;
    `}
    }
    > div:last-child {
      background-color: #808acab8;
    }
  }
`

const ExplanationWrapper = styled.div`
  margin-left: 2rem;
  padding: 2rem;
  font-variation-settings: 'wght' 200;
  background: ${(props) => transparentize(0.7, props.theme.purple)};
  border-radius: 1rem;
  font-size: 85%;
  p {
    margin: 0;
  }
`
