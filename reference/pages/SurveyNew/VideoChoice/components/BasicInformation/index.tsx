import { Grid } from "@mui/material"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { memo, useEffect, useMemo } from "react"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import { useTranslation } from "react-i18next"
import InputTextfield from "components/common/inputs/InputTextfield"
import Button, { BtnType } from "components/common/buttons/Button"
import { Save as SaveIcon } from '@mui/icons-material';
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { editableProject } from "helpers/project"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes"
import { ProjectService } from "services/project"
import { setProjectReducer } from "redux/reducers/Project/actionTypes"

interface BasicInformationForm {
  category: string,
}

interface BasicInformationProps {
  step: number,
  project: Project
}

const BasicInformation = memo(({ step, project }: BasicInformationProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const editable = useMemo(() => editableProject(project), [project])

  const schema = yup.object().shape({
    category: yup.string(),
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BasicInformationForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: BasicInformationForm) => {
    if (!editable) return
    dispatch(setLoading(true))
    ProjectService.updateProjectBasicInformation(project.id, data)
      .then((res) => {
        dispatch(setProjectReducer({
          ...project,
          category: data.category,
        }))
        dispatch(setSuccessMess(res.message))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    if (project) {
      reset({
        category: project.category,
      })
    }
  }, [project, reset])

  return (
    <Grid component="form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)} id={SETUP_SURVEY_SECTION.basic_information}>
      <Heading4 $fontSizeMobile={"16px"} mb={1} $colorName="--eerie-black" translation-key="setup_survey_video_choice_basic_infor_title">{t('setup_survey_video_choice_basic_infor_title', { step: step })}</Heading4>
      <ParagraphBody $colorName="--gray-80" mb={{ xs: 1, sm: 2 }} translation-key="setup_survey_video_choice_basic_infor_sub_title">{t('setup_survey_video_choice_basic_infor_sub_title')}</ParagraphBody>
      <Grid container spacing={2} maxWidth={{ xs: "unset", sm: "684px" }}>
        <Grid item xs={12} sm={6} id={`${SETUP_SURVEY_SECTION.basic_information}-category`}>
          <InputTextfield
            translation-key="field_video_choice_project_category"
            name="category"
            placeholder={t('field_video_choice_project_category_placeholder')}
            translation-key-placeholder="field_video_choice_project_category_placeholder"
            inputRef={register('category')}
            errorMessage={errors.category?.message}
          />
        </Grid>
      </Grid>
      {editable && (
        <Button
          sx={{ mt: 2, width: { xs: "100%", sm: "auto" } }}
          type="submit"
          btnType={BtnType.Outlined}
          translation-key="common_save_changes"
          children={<TextBtnSmall>{t('common_save_changes')}</TextBtnSmall>}
          startIcon={<SaveIcon sx={{ fontSize: "16px !important" }} />}
        />
      )}
    </Grid>
  )
})

export default BasicInformation