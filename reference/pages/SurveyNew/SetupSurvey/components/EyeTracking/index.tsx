import { Box, Grid, ListItemIcon, MenuItem } from "@mui/material";
import clsx from "clsx";
import Switch from "components/common/inputs/Switch";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { TotalPrice } from "helpers/price";
import ProjectHelper, { editableProject } from "helpers/project";
import { Project, SETUP_SURVEY_SECTION } from "models/project";
import PopupConfirmDisableEyeTracking from "pages/SurveyNew/components/PopupConfirmDisableEyeTracking";
import { PriceChip } from "pages/SurveyNew/components";
import { memo, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getEyeTrackingPacksRequest, setProjectReducer, setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { ProjectService } from "services/project";
import classes from "./styles.module.scss"
import { AddAPhoto, Circle, Help as HelpIcon, Edit as EditIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import BasicTooltip from "components/common/tooltip/BasicTooltip";
import Heading5 from "components/common/text/Heading5";
import ChipPackType from "components/common/status/ChipPackType";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { Pack, PackPosition } from "models/pack";
import PackItem from "../PackItem";
import { PackService } from "services/pack";
import { Menu } from "components/common/memu/Menu";
import PopupPack from "pages/SurveyNew/components/PopupPack";
import PopupConfirmDelete from "components/PopupConfirmDelete";
import NoteWarning from "components/common/warnings/NoteWarning";

interface EyeTrackingProps {
  price: TotalPrice;
  project: Project;
  step: number;
}

const EyeTracking = memo(({ project, price, step }: EyeTrackingProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [addNewPack, setAddNewPack] = useState<boolean>(false);
  const [packAction, setPackAction] = useState<Pack>();
  const [packEdit, setPackEdit] = useState<Pack>();
  const [packDelete, setPackDelete] = useState<Pack>();
  const [anchorElPack, setAnchorElPack] = useState<null | HTMLElement>(null);
  const [openConfirmDisableEyeTracking, setOpenConfirmDisableEyeTracking] = useState(false);

  const maxEyeTrackingPack = useMemo(() => project?.solution?.maxEyeTrackingPack || 0, [project])

  const eyeTrackingPackNeedMore = useMemo(() => ProjectHelper.eyeTrackingPackNeedMore(project), [project])

  const editable = useMemo(() => editableProject(project), [project])

  const onOpenPopupConfirmDisableEyeTracking = () => {
    setOpenConfirmDisableEyeTracking(true);
  }

  const onClosePopupConfirmDisableEyeTracking = () => {
    setOpenConfirmDisableEyeTracking(false);
  }

  const onConfirmedDisableEyeTracking = () => {
    onToggleEyeTracking(true)
    onClosePopupConfirmDisableEyeTracking()
  }

  const onToggleEyeTracking = (confirmed: boolean = false) => {
    const enableEyeTracking = !project?.enableEyeTracking;
    if (!enableEyeTracking && !confirmed && !!project?.eyeTrackingPacks?.length) {
      onOpenPopupConfirmDisableEyeTracking()
      return
    }
    dispatch(setLoading(true))
    ProjectService.updateEnableEyeTracking(project.id, { enableEyeTracking: enableEyeTracking })
      .then((res) => {
        const eyeTrackingSampleSize = (res.data as Project).eyeTrackingSampleSize
        dispatch(setProjectReducer({ ...project, enableEyeTracking: enableEyeTracking, eyeTrackingSampleSize, eyeTrackingPacks: [] }));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onAction = (currentTarget: any, item: Pack) => {
    setAnchorElPack(currentTarget)
    setPackAction(item)
  }

  const onCloseMenu = () => {
    setAnchorElPack(null)
    setPackAction(null)
  }

  const handleEdit = () => {
    if (!packAction) return
    setPackEdit(packAction)
    onCloseMenu()
  }

  const handleDelete = () => {
    if (!packAction) return
    setPackDelete(packAction)
    onCloseMenu()
  }

  const onCloseAddOrEditPack = () => {
    setAddNewPack(false)
    setPackEdit(null)
  }

  const onAddOrEditPack = (data: FormData) => {
    data.append('projectId', `${project.id}`)
    if (packEdit) {
      dispatch(setLoading(true))
      PackService.update(packEdit.id, data)
        .then(() => {
          dispatch(getEyeTrackingPacksRequest(project.id))
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      PackService.create(data)
        .then(() => {
          dispatch(getEyeTrackingPacksRequest(project.id))
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    onCloseAddOrEditPack()
  }

  const onDeletePack = () => {
    if (!packDelete) return
    dispatch(setLoading(true))
    PackService.delete(packDelete.id)
      .then(() => {
        dispatch(getEyeTrackingPacksRequest(project.id))
        setPackDelete(null)
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }
  const onGoAddPacks = () => {
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.upload_packs))
  }
  return (
    <Grid id={SETUP_SURVEY_SECTION.eye_tracking} mt={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Box mr={1} display="flex" alignItems="center">
          {editable && (
            <Switch
              checked={project?.enableEyeTracking}
              onChange={() => onToggleEyeTracking()}
            />
          )}
          <Heading4
            $fontSizeMobile={"16px"}
            $colorName="--eerie-black"
            translation-key="setup_survey_eye_tracking_title"
            className={clsx({ [classes.titleDisabled]: !project?.enableEyeTracking })}
          >
            {t("setup_survey_eye_tracking_title", { step: step })}
          </Heading4>
          {!!project?.solution?.eyeTrackingHelp && (
            <BasicTooltip arrow title={<div dangerouslySetInnerHTML={{ __html: project?.solution.eyeTrackingHelp }}></div>}>
              <HelpIcon sx={{ fontSize: 20, ml: 1, color: !project?.enableEyeTracking ? "var(--gray-40)" : "var(--gray-60)" }} />
            </BasicTooltip>
          )}
        </Box>
        <Box sx={{ml:"auto"}}>
          <PriceChip
            className={clsx({ 'disabled': !project?.enableEyeTracking })}
            label={<ParagraphSmall translation-key="common_samples, setup_survey_custom_question_cost_description">
              {project?.enableEyeTracking ? `${price?.eyeTrackingSampleSizeCost?.show} ( ${project?.eyeTrackingSampleSize || 0} ${t("common_samples")})` : `${t("setup_survey_custom_question_cost_description")}`}
            </ParagraphSmall>}
          />
        </Box>
      </Box>
      <ParagraphBody
        $colorName="--gray-80"
        mt={1}
        translation-key="setup_survey_eye_tracking_sub_title"
        className={clsx({ [classes.titleSubDisabled]: !project?.enableEyeTracking })}
      >
        {t("setup_survey_eye_tracking_sub_title")}
      </ParagraphBody>
      {!!project?.enableEyeTracking && (
        <>
          <Box mt={2}>
            <Circle sx={{ color: "var(--gray-30)", fontSize: 12, verticalAlign: "middle", display: "inline-flex" }} />
            <Heading5 sx={{ verticalAlign: "middle", display: "inline-flex", ml: 1 }} $colorName="--eerie-black" translation-key="setup_eye_tracking_option_attraction">{t("setup_eye_tracking_option_attraction")}</Heading5>
          </Box>
          <ParagraphBody mt={1} $colorName="--gray-80" translation-key="setup_eye_tracking_option_attraction_subtitle">{t("setup_eye_tracking_option_attraction_subtitle")}</ParagraphBody>
          {!project?.packs?.length && (
            <NoteWarning>
                <ParagraphSmall translation-key="setup_eye_tracking_note_warning_1, setup_eye_tracking_note_warning_2, setup_eye_tracking_note_warning_3" 
                $colorName="--warning-dark" 
                >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <span>{t("setup_eye_tracking_note_warning_1")}{" "}</span><a className="underline" onClick={onGoAddPacks}>{t("setup_eye_tracking_note_warning_2")}</a>{" "}<span>{t("setup_eye_tracking_note_warning_3")}</span>
                </ParagraphSmall>
            </NoteWarning>
          )}
          {!!project?.packs?.length && (
            <Box mt={2}>
              <Grid spacing={2} container>
                {project?.packs?.map(item => (
                  <Grid item className={classes.packItem} key={item.id}>  
                    <Box className={classes.packItemBox}>
                      <Box className={classes.packItemImgBox}>
                        <img src={item.image} alt="pack" />
                      </Box>
                      <Box className={classes.packItemRightBox}>
                        <ParagraphSmall mb={1} className="ellipsis" $colorName="--eerie-black">{item.name}</ParagraphSmall>
                        <ChipPackType className={classes.packItemChipPackType} status={item.packTypeId} />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          <Box mt={3}>
            <Circle sx={{ color: "var(--gray-30)", fontSize: 12, verticalAlign: "middle", display: "inline-flex" }} />
            <Heading5 sx={{ verticalAlign: "middle", display: "inline-flex", ml: 1 }} $colorName="--eerie-black" translation-key="setup_eye_tracking_option_effect">{t("setup_eye_tracking_option_effect")}</Heading5>
          </Box>
          <ParagraphBody mt={1} $colorName="--gray-80" translation-key="setup_eye_tracking_option_effect_subtitle_head">
            {t("setup_eye_tracking_option_effect_subtitle_head")}
          </ParagraphBody>
          <ParagraphBody mt={2} $colorName="--gray-80" translation-key="setup_eye_tracking_option_effect_subtitle_content"
            dangerouslySetInnerHTML={{
              __html: t("setup_eye_tracking_option_effect_subtitle_content"),
            }}>
          </ParagraphBody>
            { !!eyeTrackingPackNeedMore && (
            <NoteWarning>
                <ParagraphSmall translation-key="setup_eye_tracking_note_warning_min_packs" 
                $colorName="--warning-dark" 
                sx={{"& > span": {fontWeight: 600}}}
                dangerouslySetInnerHTML={{
                __html: t("setup_eye_tracking_note_warning_min_packs", {
                number: eyeTrackingPackNeedMore,
                }),
                }}
                >
                </ParagraphSmall>
            </NoteWarning>)}
          {!!project?.eyeTrackingPacks?.length && (
            <Box mt={{ xs: 3, sm: 2 }} >
              <Grid spacing={2} container>
                {project?.eyeTrackingPacks?.map((item, index) => (
                  <PackItem
                    key={index}
                    item={item}
                    editable={editable}
                    onAction={onAction}
                  />
                ))}
              </Grid>
            </Box>
          )}
          {(maxEyeTrackingPack > project?.eyeTrackingPacks?.length && editable) && (
            <Button
              sx={{ mt: 3, width: { xs: "100%", sm: "300px" } }}
              btnType={BtnType.Outlined}
              translation-key="setup_survey_packs_add_competitor_pack"
              children={<TextBtnSmall>{t('setup_survey_packs_add_competitor_pack')}</TextBtnSmall>}
              startIcon={<AddAPhoto sx={{ fontSize: "16px !important" }} />}
              onClick={() => setAddNewPack(true)}
            />
          )}
        </>
      )}
      <PopupConfirmDisableEyeTracking
        isOpen={openConfirmDisableEyeTracking}
        onCancel={onClosePopupConfirmDisableEyeTracking}
        onYes={onConfirmedDisableEyeTracking}
      />
      <Menu
        $minWidth={"120px"}
        anchorEl={anchorElPack}
        open={Boolean(anchorElPack)}
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
      <PopupPack
        isOpen={addNewPack}
        itemEdit={packEdit}
        positionId={PackPosition.Eye_Tracking}
        onCancel={onCloseAddOrEditPack}
        onSubmit={onAddOrEditPack}
      />
      <PopupConfirmDelete
        isOpen={!!packDelete}
        title={t('setup_survey_pack_confirm_delete_title')}
        description={t('setup_survey_pack_confirm_delete_sub_title')}
        onCancel={() => setPackDelete(null)}
        onDelete={onDeletePack}
      />
    </Grid>
  )
})

export default EyeTracking