import { CookieBanner } from '@past3lle/components'
import { devDebug } from '@past3lle/utils'
import { initAnalytics } from 'analytics/hooks/useAnalyticsReporter'

export function CookiesBanner() {
  return (
    <CookieBanner
      storageKey={process.env.REACT_APP_PASTELLE_COOKIE_SETTINGS || 'PASTELLE_SHOP_cookies'}
      message={'COOKIES?'}
      fullText={
        <div>
          <p>
            WE REALLY ONLY HAVE OPT-IN <strong>MARKETING</strong> COOKIES FOR 2 REASONS:
          </p>
          <div style={{ marginLeft: '2rem' }}>
            <p>1. Send you details on newest collections</p>
            <p>2. See which kind of our merch is preferred and continue delivering similar quality</p>
          </div>
        </div>
      }
      onAcceptAnalytics={() => console.warn('ACCEPT ANALYTICS')}
      onSaveAndClose={(cookieState) => {
        devDebug('COOKIE BANNER SAVED AND CLOSED.', cookieState)
        initAnalytics(cookieState)
      }}
    />
  )
}
