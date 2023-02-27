import { CookieBanner } from '@past3lle/components'
import { devDebug } from '@past3lle/utils'
import { initAnalytics } from 'analytics/hooks/useAnalyticsReporter'

export function CookiesBanner() {
  return (
    <CookieBanner
      storageKey={process.env.REACT_APP_PASTELLE_COOKIE_SETTINGS || 'PASTELLE_COOKIE_SETTINGS'}
      message={'COOKIES?'}
      fullText={
        <div>
          <p>
            WE REALLY ONLY HAVE OPT-IN <strong>ANALYTICS</strong> COOKIES FOR 3 REASONS:
          </p>
          <div style={{ marginLeft: '2rem' }}>
            <p>1. See which of our items are most popular</p>
            <p>2. Assess which parts of our site aren&apos;t working well and/or where you guys are getting stuck</p>
            <p>3. Get a sense for if you guys like the showcase video option and other new features</p>
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
