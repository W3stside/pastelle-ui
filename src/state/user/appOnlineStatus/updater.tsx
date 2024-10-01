import { Row, Text } from '@past3lle/components'
import { LAYOUT_REM_SIZE_MAP } from '@past3lle/constants'
import { useOfflineOnlineDetection } from '@past3lle/hooks'
import { upToSmall } from '@past3lle/theme'
import { Z_INDEXES } from '@/constants/config'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/state'
import styled from 'styled-components/macro'

import { addBannerMessage, removeBannerMessage } from '../reducer'

export function AppOnlineStatusUpdater() {
  const bannerMessages = useAppSelector((state) => state.user.bannerMessages)
  const dispatch = useAppDispatch()

  useOfflineOnlineDetection({
    handleOffline: () =>
      dispatch(
        addBannerMessage({
          key: 'OFFLINE',
          message: [
            { elem: 'span', id: 'lenny-face', content: 'ʕ ͡° ʖ̯ ͡°ʔ', style: { fontVariationSettings: "'wght' 800" } },
            {
              elem: 'span',
              content: ' APP OFFLINE!',
            },
            {
              elem: 'span',
              className: 'hidden-mobile',
              content: ' PLEASE CHECK CONNECTION.',
            },
          ],
        }),
      ),
    handleOnline: () => dispatch(removeBannerMessage({ key: 'OFFLINE' })),
  })

  // EFFECT: remove banners on unmount
  useEffect(() => {
    return () => {
      dispatch(removeBannerMessage({ key: 'OFFLINE' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!bannerMessages?.['OFFLINE']) return null

  return (
    <BannerMessage>
      <Text.Main>
        {bannerMessages.OFFLINE.map(({ elem, content, ...rest }, idx) => {
          const Component = elem
          return (
            <Component key={idx} {...rest}>
              {content}
            </Component>
          )
        })}
      </Text.Main>
    </BannerMessage>
  )
}

const BannerMessage = styled(Row)`
  position: fixed;
  top: ${LAYOUT_REM_SIZE_MAP.HEADER}rem;
  left: 0;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #f07f7ff2;
  z-index: ${Z_INDEXES.MODALS};
  align-items: center;

  ${upToSmall`
    justify-content: center;
  `}

  > ${Text.Main} {
    font-size: 2.5rem;
    font-variation-settings: 'wght' 100;
    color: black;

    ${upToSmall`
      .hidden-mobile {
        display: none;
      }
    `}
  }
`
