import { Grid, ListItemIcon, MenuItem, Box } from "@mui/material"
import Button, { BtnType } from "components/common/buttons/Button"
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { MaxChip } from "pages/SurveyNew/components"
import { memo, useMemo, useState } from "react"
import PackItem from "../PackItem"
import { AddAPhoto, Edit as EditIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { editableProject } from "helpers/project"
import PopupConfirmDelete from "components/PopupConfirmDelete"
import { Pack } from "models/pack"
import { Menu } from "components/common/memu/Menu";
import { PackService } from "services/pack"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { getPacksRequest } from "redux/reducers/Project/actionTypes"
import PopupPack from "pages/SurveyNew/components/PopupPack"
import ProjectHelper from "helpers/project";
import NoteWarning from "components/common/warnings/NoteWarning";

interface UploadPacksProps {
  project: Project
}

const UploadPacks = memo(({ project }: UploadPacksProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [addNewPack, setAddNewPack] = useState<boolean>(false);
  const [packAction, setPackAction] = useState<Pack>();
  const [packEdit, setPackEdit] = useState<Pack>();
  const [packDelete, setPackDelete] = useState<Pack>();
  const [anchorElPack, setAnchorElPack] = useState<null | HTMLElement>(null);

  const maxPack = useMemo(() => project?.solution?.maxPack || 0, [project])

  const editable = useMemo(() => editableProject(project), [project])

  const enableAddPacks = useMemo(() => {
    return maxPack > (project?.packs?.length || 0)
  }, [maxPack, project])

  const packNeedMore = useMemo(() => ProjectHelper.packNeedMore(project), [project])

  const onDeletePack = () => {
    if (!packDelete) return
    dispatch(setLoading(true))
    PackService.delete(packDelete.id)
      .then(() => {
        dispatch(getPacksRequest(project.id))
        setPackDelete(null)
      })
      .catch(e => dispatch(setErrorMess(e)))
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
          dispatch(getPacksRequest(project.id))
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      PackService.create(data)
        .then(() => {
          dispatch(getPacksRequest(project.id))
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    onCloseAddOrEditPack()
  }

  return (
    <Grid id={SETUP_SURVEY_SECTION.upload_packs} mt={4}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        translation-key="setup_survey_summary_pack"
        sx={{ display: "inline-block", verticalAlign: "middle" }}
      >
        {t('setup_survey_summary_pack', { step: 2 })}
      </Heading4>
      <MaxChip sx={{ ml: 1 }} label={<ParagraphSmall $colorName="--eerie-black">{t('common_max')} {maxPack}</ParagraphSmall>} />
      <ParagraphBody $colorName="--gray-80" mt={1} translation-key="setup_survey_packs_sub_title">{t("setup_survey_packs_sub_title")}</ParagraphBody>
      {!!packNeedMore && (
        <NoteWarning>
          <ParagraphSmall translation-key="setup_add_packs_note_warning" 
          $colorName="--warning-dark" 
          sx={{"& > span": {fontWeight: 600}}}
          dangerouslySetInnerHTML={{
          __html: t("setup_add_packs_note_warning", {
          number: packNeedMore,}),
          }}>
          </ParagraphSmall>
      </NoteWarning>
      )}
      {!!project?.packs?.length && (
        <Box mt={{ xs: 3, sm: 2 }} >
          <Grid spacing={2} container>
            {project?.packs?.map((item, index) => (
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
      <Button
        sx={{ mt: 3, width: { xs: "100%", sm: "300px" } }}
        btnType={BtnType.Outlined}
        disabled={!enableAddPacks || !editable}
        translation-key="setup_survey_packs_add"
        children={<TextBtnSmall>{t('setup_survey_packs_add')}</TextBtnSmall>}
        startIcon={<AddAPhoto sx={{ fontSize: "16px !important" }} />}
        onClick={() => setAddNewPack(true)}
      />
      {!enableAddPacks && (
        <ParagraphSmall mt={1} translation-key="setup_survey_add_pack_error_max" $colorName="--red-error">{t('setup_survey_add_pack_error_max', { number: maxPack })}</ParagraphSmall>
      )}
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

export default UploadPacks