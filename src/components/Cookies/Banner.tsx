import { CookieBanner } from '@past3lle/components'
import { devDebug } from '@past3lle/utils'
import { initAnalytics } from '@/analytics/hooks/useAnalyticsReporter'
import { useAppColourTheme } from '@/state/user/hooks'

export function CookiesBanner() {
  const { mode } = useAppColourTheme()
  return (
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
                font-variation-settings: 'wght' 100;
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
      storageKey={import.meta.env.VITE_PASTELLE_COOKIE_SETTINGS || 'PASTELLE_SHOP_cookies'}
      message={'COOKIES?'}
      fullText={
        <div>
          <p>PASTELLE APPAREL cookie policy -- please read and make a selection below!</p>
          <p>
            OPT-IN <strong>MARKETING</strong> COOKIES -- why?
          </p>
          <div style={{ marginLeft: '2rem' }}>
            <p>
              1. Send you details on newest collections and items related to what you may have purchased in the past
            </p>
            <p>2. See which kind of our merch is preferred and continue delivering similar quality to you</p>
          </div>
          <p>Closing the banner will submit the current selected options. By default that is just the essentials.</p>
        </div>
      }
      onAcceptMarketing={() => console.warn('ACCEPT MARKETING')}
      onSaveAndClose={(cookieState) => {
        devDebug('COOKIE BANNER SAVED AND CLOSED.', cookieState)
        initAnalytics(cookieState)
      }}
    />
  )
}
