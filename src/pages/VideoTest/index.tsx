import LazyVideo from 'components/LazyVideo'
import useUpdatedRef from 'hooks/useUpdatedRef'

const VIDEOS = [
  'https://media.istockphoto.com/videos/healthy-fruit-and-nut-cereal-closeup-shot-video-id1372848592',
  'https://ik.imagekit.io/pastelle/APPAREL/2022/FALL/ELLEX/VIDEOS/back_W76cqDjaR.webm',
  'https://media.istockphoto.com/videos/bananas-pile-up-food-animation-video-id1320318210',
  'https://media.istockphoto.com/videos/top-view-of-healthy-breakfast-smoothie-bowls-of-mixed-berries-fruit-video-id1338791680',
  'https://ik.imagekit.io/pastelle/APPAREL/2022/FALL/ELLEX/VIDEOS/back_W76cqDjaR.webm',
  'https://ik.imagekit.io/pastelle/APPAREL/2022/FALL/ELLEX/VIDEOS/front_qNOpNgd2z.webm'
]

export default function VideoPage() {
  //   const { refToSet, updatedRef } = useUpdatedRef<(HTMLVideoElement | null)[]>({ refDefault: [] })
  const { refToSet: divRef, updatedRef: divUpdatedRef } = useUpdatedRef<HTMLDivElement | null>({ refDefault: null })

  // const clientHeight = useElemOrParentHeight({ elem: divUpdatedRef?.current, findParent: false })

  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap', width: '600px', overflow: 'auto' }} ref={divRef}>
      {VIDEOS.map((video, index) => (
        <LazyVideo
          //   ref={el => (refToSet.current[index] = el)}
          key={index}
          sourcesProps={[
            { src: video + '?tr=q-1', type: 'video/mp4' },
            { src: video + '?tr=q-1', type: 'video/webm' }
          ]}
          container={divUpdatedRef?.current}
          minHeight={800}
        />
      ))}
    </div>
  )
}
