import { MoreVert } from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material"
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { EVIDEO_TYPE, Video } from "models/video"
import { memo } from "react"
import classes from './styles.module.scss';
import ShowMoreText from "react-show-more-text";
import Heading5 from "components/common/text/Heading5";
import { IconBranding, IconMessage, IconProduct, IconScenes } from "components/icons";
import { useTranslation } from "react-i18next";
import BasicTooltip from "components/common/tooltip/BasicTooltip";


interface VideoItemProps {
  item: Video;
  editable: boolean;
  onAction: (currentTarget: any, item: Video) => void;
}

const VideoItem = memo(({ item, editable, onAction }: VideoItemProps) => {
  const { t } = useTranslation()
  return (
    <Grid item className={classes.root}>
      <Box className={classes.box}>
        <Grid className={classes.body}>
          {editable && (
            <IconButton
              className={classes.iconAction}
              onClick={(e) => onAction(e.currentTarget, item)}
            >
              <MoreVert />
            </IconButton>
          )}
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
            {!!item.videoScenes?.length && (
              <Box className={classes.chipDuration}>
                <BasicTooltip title={t("setup_video_choice_tooltip_scenes")} translation-key="setup_video_choice_tooltip_scenes">
                  <div><IconScenes /></div>
                </BasicTooltip>
                <ParagraphBody $colorName="--cimigo-green-dark-2">{item.videoScenes?.length || 0}</ParagraphBody>
              </Box>
            )}
          </Grid>
          <Grid sx={{ mt: 2 }}>
            <Box className={classes.textItem}>
              <BasicTooltip arrow title={t("setup_video_choice_tooltip_brand_name")} translation-key="setup_video_choice_tooltip_brand_name">
                <div><IconBranding /></div>
              </BasicTooltip>
              <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>{item.brand}</ParagraphSmall>
            </Box>
            <Box className={classes.textItem}>
              <BasicTooltip arrow title={t("setup_video_choice_tooltip_product_name")} translation-key="setup_video_choice_tooltip_product_name">
                <div><IconProduct /></div>
              </BasicTooltip>
              <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>{item.product}</ParagraphSmall>
            </Box>
            <Box className={classes.textItem}>
              <BasicTooltip arrow title={t("setup_video_choice_tooltip_key_message")} translation-key="setup_video_choice_tooltip_key_message">
                <div><IconMessage /></div>
              </BasicTooltip>
              <Grid sx={{ flex: 1 }}>
                <ShowMoreText
                  lines={2}
                  more={t("setup_video_choice_video_item_show_more")}
                  less={t("setup_video_choice_video_item_show_less")}
                  anchorClass={classes.textControl}
                  truncatedEndingComponent={"... "}
                  expanded={false}
                  width={480}
                  className={classes.wrapperText}
                >
                  {item.keyMessage}
                </ShowMoreText>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  )
})

export default VideoItem