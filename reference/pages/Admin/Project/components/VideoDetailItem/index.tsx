import { Box, Grid } from "@mui/material"
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { EVIDEO_TYPE, Video } from "models/video"
import { memo } from "react"
import classes from './styles.module.scss';
import ShowMoreText from "react-show-more-text";
import Heading5 from "components/common/text/Heading5";
import { IconBranding, IconMessage, IconProduct, IconScenes } from "components/icons";
import { CloudUploadOutlined as CloudUploadOutlinedIcon, YouTube as YouTubeIcon } from '@mui/icons-material';
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { AttachmentService } from "services/attachment"
import FileSaver from 'file-saver';
import moment from "moment";

interface VideoItemProps {
  item: Video;
}

const VideoDetailItem = memo(({ item }: VideoItemProps) => {

  const dispatch = useDispatch()

  const onDownloadVideo = () => {
    dispatch(setLoading(true))
    AttachmentService.download(item.uploadVideoId)
      .then((res) => {
        FileSaver.saveAs(res.data, item.uploadVideo.fileName)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const formatSeneTime = (value: number) => {
    return moment().startOf('day').add(value, 'seconds').format('mm:ss')
  }

  return (
    <Grid item className={classes.root}>
      <Box className={classes.box}>
        <Grid className={classes.body}>
          {item.typeId === EVIDEO_TYPE.UPLOAD && (
            <video
              width="300"
              height="168.75"
              className={classes.video}
              title="Video from device"
              controls
              src={item.uploadVideo.url}
            >
            </video>
          )}
          {item.typeId === EVIDEO_TYPE.YOUTUBE && (
            <iframe
              width="300"
              height="168.75"
              className={classes.video}
              src={`https://www.youtube.com/embed/${item.youtubeVideoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen>
            </iframe>
          )}
        </Grid>
        <Grid className={classes.footer}>
          <Grid className={classes.footerTitle}>
            <Heading5 mb={1}>{item.name}</Heading5>
            <Box className={classes.chipDuration}>
              <IconScenes />
              <ParagraphBody $colorName="--cimigo-green-dark-2">{item.videoScenes?.length || 0}</ParagraphBody>
            </Box>
          </Grid>
          <Grid sx={{ mt: 2 }}>
            {item.typeId === EVIDEO_TYPE.YOUTUBE && (
              <Box className={classes.textItem}>
                <YouTubeIcon sx={{ color: '#FF0000', fontSize: 18 }} />
                <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>Youtube video link: <a className="underline" target="_blank" rel="noopener noreferrer" href={`https://www.youtube.com/watch?v=${item.youtubeVideoId}`}>https://www.youtube.com/watch?v={item.youtubeVideoId}</a></ParagraphSmall>
              </Box>
            )}
            {item.typeId === EVIDEO_TYPE.UPLOAD && (
              <Box className={classes.textItem}>
                <CloudUploadOutlinedIcon sx={{ color: 'var(--eerie-black)', fontSize: 18 }} />
                <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>Video file: <span className="underline cursor-pointer" onClick={onDownloadVideo}>Download</span></ParagraphSmall>
              </Box>
            )}
            <Box className={classes.textItem}>
              <IconBranding />
              <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>{item.brand}</ParagraphSmall>
            </Box>
            <Box className={classes.textItem}>
              <IconProduct />
              <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>{item.product}</ParagraphSmall>
            </Box>
            <Box className={classes.textItem}>
              <IconMessage />
              <Grid sx={{ flex: 1 }}>
                <ShowMoreText
                  lines={2}
                  more={'Show more'}
                  less={'Show less'}
                  anchorClass={classes.textControl}
                  expanded={false}
                  width={480}
                  className={classes.wrapperText}
                >
                  {item.keyMessage}
                </ShowMoreText>
              </Grid>
            </Box>
          </Grid>
          {!!item.videoScenes?.length && (
            <Box>
              <Heading5 mt={2} mb={2}>Scenes</Heading5>
              <Box>
                {item.videoScenes.map(scene => (
                  <Box key={scene.id} className={classes.sceneItem}>
                    <ParagraphSmall $colorName="--eerie-black" className={classes.sceneItemText}><span>Name: </span>{scene.name}</ParagraphSmall>
                    <ParagraphSmall $colorName="--eerie-black" className={classes.sceneItemText}><span>Start time: </span>{formatSeneTime(scene.startTime)}</ParagraphSmall>
                    <ParagraphSmall $colorName="--eerie-black" className={classes.sceneItemText}><span>End time: </span>{formatSeneTime(scene.endTime)}</ParagraphSmall>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Box>
    </Grid>
  )
})

export default VideoDetailItem