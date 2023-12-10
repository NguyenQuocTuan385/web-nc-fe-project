import { Grid, ListItemIcon, MenuItem, Box } from "@mui/material"
import Button, { BtnType } from "components/common/buttons/Button"
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { MaxChip } from "pages/SurveyNew/components"
import { memo, useMemo, useState } from "react"
import { Edit as EditIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { editableProject } from "helpers/project"
import PopupConfirmDelete from "components/PopupConfirmDelete"
import { EVIDEO_TYPE, Video } from "models/video"
import { Menu } from "components/common/memu/Menu";
import { VideoService } from "services/video"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { getVideosRequest } from "redux/reducers/Project/actionTypes"
import ProjectHelper from "helpers/project";
import NoteWarning from "components/common/warnings/NoteWarning";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import classes from "./styles.module.scss";
import VideoItem from "../VideoItem";
import { IconAddVideoMenu } from "components/icons";
import PopupAddVideo from "pages/SurveyNew/components/PopupAddVideo";

interface AddVideosProps {
  step: number,
  project: Project
}

const AddVideos = memo(({ step, project }: AddVideosProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [addNewVideo, setAddNewVideo] = useState<boolean>(false);
  const [videoAction, setVideoAction] = useState<Video>();
  const [videoEdit, setVideoEdit] = useState<Video>();
  const [videoDelete, setVideoDelete] = useState<Video>();
  const [anchorElVideo, setAnchorElVideo] = useState<null | HTMLElement>(null);
  const [anchorElMenuAddVideo, setAnchorElMenuAddVideo] = useState<null | HTMLElement>(null);
  const [typeAddVideo, setTypeAddVideo] = useState(null);

  const maxVideo = useMemo(() => project?.solution?.maxVideo || 0, [project])

  const editable = useMemo(() => editableProject(project), [project])

  const enableAddVideos = useMemo(() => {
    return maxVideo > (project?.videos?.length || 0)
  }, [maxVideo, project])

  const videoNeedMore = useMemo(() => ProjectHelper.videoNeedMore(project), [project])

  const onOpenPopupAddVideo = (type: EVIDEO_TYPE) => {
    switch (type) {
      case EVIDEO_TYPE.UPLOAD:
        setAddNewVideo(true);
        setTypeAddVideo(EVIDEO_TYPE.UPLOAD);
        break;
      case EVIDEO_TYPE.YOUTUBE:
        setAddNewVideo(true);
        setTypeAddVideo(EVIDEO_TYPE.YOUTUBE);
        break;
      default:
        break;
    }
    handleCloseMenuAddVideo();
  }

  const onDeleteVideo = () => {
    if (!videoDelete) return
    dispatch(setLoading(true))
    VideoService.delete(videoDelete.id)
      .then(() => {
        dispatch(getVideosRequest(project.id))
        setVideoDelete(null)
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onAction = (currentTarget: any, item: Video) => {
    setAnchorElVideo(currentTarget)
    setVideoAction(item)
  }

  const onCloseMenu = () => {
    setAnchorElVideo(null)
    setVideoAction(null)
  }

  const handleEdit = () => {
    if (!videoAction) return
    setVideoEdit(videoAction)
    onCloseMenu()
  }

  const handleDelete = () => {
    if (!videoAction) return
    setVideoDelete(videoAction)
    onCloseMenu()
  }

  const onCloseAddOrEditVideo = () => {
    setAddNewVideo(false)
    setVideoEdit(null)
  }

  const onReload = () => {
    dispatch(getVideosRequest(project.id))
  }

  const handleClickMenuAddVideo = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuAddVideo(event.currentTarget)
  }

  const handleCloseMenuAddVideo = () => {
    setAnchorElMenuAddVideo(null);
  }

  return (
    <Grid id={SETUP_SURVEY_SECTION.add_video} mt={4}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        translation-key="setup_survey_video_choice_add_video_title"
        sx={{ display: "inline-block", verticalAlign: "middle" }}
      >
        {t("setup_survey_video_choice_add_video_title", { number: step })}
      </Heading4>
      <MaxChip sx={{ ml: 1 }} label={<ParagraphSmall $colorName="--eerie-black">{t('common_max')} {maxVideo}</ParagraphSmall>} />
      <ParagraphBody $colorName="--gray-80" mt={1} translation-key="setup_survey_video_choice_add_video_sub_title">
        {t("setup_survey_video_choice_add_video_sub_title")}
      </ParagraphBody>
      {!!videoNeedMore && (
        <NoteWarning>
          <ParagraphSmall translation-key="setup_add_videos_note_warning"
            $colorName="--warning-dark"
            sx={{ "& > span": { fontWeight: 600 } }}
            dangerouslySetInnerHTML={{
              __html: t("setup_add_videos_note_warning", {
                number: videoNeedMore,
              }),
            }}
          >
          </ParagraphSmall>
        </NoteWarning>
      )}
      <Box mt={{ xs: 3, sm: 3 }} >
        <Grid spacing={2} container>
          {project?.videos?.map((item, index) => (
            <VideoItem
              key={index}
              item={item}
              editable={editable}
              onAction={onAction}
            />
          ))}
        </Grid>
      </Box>
      <Button
        sx={{ mt: 3, width: { xs: "100%", sm: "auto" } }}
        onClick={handleClickMenuAddVideo}
        disabled={!editable || project?.videos?.length >= maxVideo}
        btnType={BtnType.Outlined}
        translation-key=""
        startIcon={<IconAddVideoMenu sx={{ color: !editable || project?.videos?.length >= maxVideo ? 'var(--eerie-black-40)' : "#1F61A9" }} />}
        children={<TextBtnSmall translation-key="setup_video_choice_btn_add_video">{t("setup_video_choice_btn_add_video")}</TextBtnSmall>}
        endIcon={<ArrowDropDownIcon sx={{ fontSize: "16px !important" }} />}
      />
      <Menu
        $minWidth={"unset"}
        anchorEl={anchorElMenuAddVideo}
        open={Boolean(anchorElMenuAddVideo)}
        onClose={handleCloseMenuAddVideo}
      >
        <MenuItem className={classes.menuItem} onClick={() => onOpenPopupAddVideo(EVIDEO_TYPE.UPLOAD)}>
          <BackupOutlinedIcon sx={{ color: 'var(--cimigo-blue-light-1)' }} />
          <ParagraphExtraSmall className={classes.menuItemText} translation-key="setup_video_choice_add_video_from_device">{t("setup_video_choice_add_video_from_device")}</ParagraphExtraSmall>
        </MenuItem>
        <MenuItem className={classes.menuItem} onClick={() => onOpenPopupAddVideo(EVIDEO_TYPE.YOUTUBE)}>
          <YouTubeIcon sx={{ color: '#DD352E' }} />
          <ParagraphExtraSmall className={classes.menuItemText} translation-key="setup_video_choice_add_video_from_youtube">{t("setup_video_choice_add_video_from_youtube")}</ParagraphExtraSmall>
        </MenuItem>
      </Menu>
      {!enableAddVideos && (
        <ParagraphSmall mt={1} translation-key="setup_survey_add_video_error_max" $colorName="--red-error">{t("setup_survey_add_video_error_max", { number: maxVideo })}</ParagraphSmall>
      )}
      <Menu
        $minWidth={"120px"}
        anchorEl={anchorElVideo}
        open={Boolean(anchorElVideo)}
        onClose={onCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ParagraphBody translation-key="common_edit">{t('common_edit')}</ParagraphBody>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteForeverIcon sx={{ color: "var(--red-error) !important" }} fontSize="small" />
          </ListItemIcon>
          <ParagraphBody translation-key="common_delete">{t('common_delete')}</ParagraphBody>
        </MenuItem>
      </Menu>
      {(addNewVideo || !!videoEdit) && (
        <PopupAddVideo
          isOpen
          itemEdit={videoEdit}
          project={project}
          type={typeAddVideo}
          onSuccess={onReload}
          onClose={onCloseAddOrEditVideo}
        />
      )}
      <PopupConfirmDelete
        isOpen={!!videoDelete}
        title={t("setup_add_video_confirm_delete")}
        description={t("setup_add_video_confirm_delete_sub")}
        onCancel={() => setVideoDelete(null)}
        onDelete={onDeleteVideo}
      />
    </Grid>
  )
})

export default AddVideos