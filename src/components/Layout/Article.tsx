import styled from 'styled-components/macro'
import { fadeInAnimation } from 'pages/SingleItem/styleds'

const portugalBg = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT + '/portugal-bg_Rqj8jTKhFmds.jpg?tr=q-25'
const portugalBgLq =
  process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT + '/portugal-bg_Rqj8jTKhFmds.jpg?tr=h-1,w-1:h-1152,w-528'

export const ArticleFadeInContainer = styled.article`
  overflow: hidden;
  filter: contrast(1) blur(0px);

  background-image: url(${portugalBg}), url(${portugalBgLq});
  background-size: contain;

  ${fadeInAnimation};

  animation-name: fadeIn;
  animation-duration: 0.8s;
`
