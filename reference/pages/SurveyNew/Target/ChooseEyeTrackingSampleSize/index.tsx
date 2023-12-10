import { Edit, Save } from "@mui/icons-material";
import { Badge, Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import ChipCustom from "components/common/chip/ChipCustom";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { PriceService } from "helpers/price";
import _ from "lodash";
import { TARGET_SECTION } from "models/project";
import { memo, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { ReducerType } from "redux/reducers";
import { CustomEyeTrackingSampleSizeForm, _listEyeTrackingSampleSize } from "../models";
import classes from '.././styles.module.scss';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ProjectService } from "services/project";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { setProjectReducer } from "redux/reducers/Project/actionTypes";
import InputTextfield from "components/common/inputs/InputTextfield";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { ESOLUTION_TYPE } from "models";



interface Props {
  projectId: number;
  editable: boolean;
}

export const ChooseEyeTrackingSampleSize = memo(({ projectId, editable }: Props) => {

  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()

  const { project } = useSelector((state: ReducerType) => state.project)

  const [showCustomEyeTrackingSampleSize, setShowCustomEyeTrackingSampleSize] = useState(false);

  const eyeTrackingSampleSizeConstConfig = useMemo(() => {
    return PriceService.getEyeTrackingSampleSizeConstConfig(project)
  }, [project])

  const maxEyeTrackingSampeSize = useMemo(() => {
    return _.maxBy(eyeTrackingSampleSizeConstConfig, 'limit')?.limit || 0
  }, [eyeTrackingSampleSizeConstConfig])

  const minEyeTrackingSampeSize = useMemo(() => {
    return _.minBy(eyeTrackingSampleSizeConstConfig, 'limit')?.limit || 0
  }, [eyeTrackingSampleSizeConstConfig])

  const isValidEyeTrackingSampSize = (data: number) => {
    return data >= minEyeTrackingSampeSize && data <= maxEyeTrackingSampeSize
  }

  const listEyeTrackingSampleSize = useMemo(() => {
    let ListEyeTrackingSampleSizeTemp = _listEyeTrackingSampleSize.filter(it => isValidEyeTrackingSampSize(it.value))
    return ListEyeTrackingSampleSizeTemp.sort((a, b) => a.value - b.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxEyeTrackingSampeSize, minEyeTrackingSampeSize])

  const schemaESS = useMemo(() => {
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
        return yup.object().shape({
          eyeTrackingSampleSize: yup.number()
            .typeError(t("target_eye_tracking_sample_size_required"))
            .required(t("target_eye_tracking_sample_size_required"))
            .min(minEyeTrackingSampeSize, t("target_eye_tracking_sample_size_min", { number: minEyeTrackingSampeSize }))
            .max(maxEyeTrackingSampeSize, t("target_eye_tracking_sample_size_max", { number: maxEyeTrackingSampeSize }))
        })
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        const _sampleSize = project?.sampleSize || 0;
        const max = _sampleSize >= maxEyeTrackingSampeSize ? maxEyeTrackingSampeSize : _sampleSize
        return yup.object().shape({
          eyeTrackingSampleSize: yup.number()
            .typeError(t("target_eye_tracking_number_respondents_required"))
            .required(t("target_eye_tracking_number_respondents_required"))
            .min(minEyeTrackingSampeSize, t("target_eye_tracking_number_respondents_greater", {number: minEyeTrackingSampeSize}))
            .max(max, t("target_eye_tracking_number_respondents_max", {number: max}))
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, maxEyeTrackingSampeSize, minEyeTrackingSampeSize, project?.solution?.typeId, project?.sampleSize])

  const {
    handleSubmit: handleSubmitESS,
    formState: { errors: errorsESS, isValid: isValidESS },
    reset: resetESS,
    register: registerESS,
  } = useForm<CustomEyeTrackingSampleSizeForm>({
    resolver: yupResolver(schemaESS),
    mode: 'onChange'
  });

  const isCustomEyeTrackingSampleSize = useMemo(() => {
    return project?.eyeTrackingSampleSize && !listEyeTrackingSampleSize.find(it => it.value === project.eyeTrackingSampleSize)
  }, [project, listEyeTrackingSampleSize])

  const onClearCustomEyeTrackingSampleSize = () => {
    setShowCustomEyeTrackingSampleSize(false)
    resetESS({ eyeTrackingSampleSize: undefined })
  }

  const updateEyeTrackingSampleSize = (data: number) => {
    if (!isValidEyeTrackingSampSize(data) || data === project?.eyeTrackingSampleSize || !editable) {
      onClearCustomEyeTrackingSampleSize()
      return
    }
    dispatch(setLoading(true))
    ProjectService.updateEyeTrackingSampleSize(projectId, data)
      .then((res) => {
        dispatch(setProjectReducer({ ...project, eyeTrackingSampleSize: data }))
        dispatch(setSuccessMess(res.message))
        onClearCustomEyeTrackingSampleSize()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const _onSubmitESS = (data: CustomEyeTrackingSampleSizeForm) => {
    updateEyeTrackingSampleSize(data.eyeTrackingSampleSize)
  }

  const onCustomEyeTrackingSampleSize = () => {
    if (!editable) return
    setShowCustomEyeTrackingSampleSize(true)
    if (isCustomEyeTrackingSampleSize) {
      resetESS({ eyeTrackingSampleSize: project?.eyeTrackingSampleSize || 0 })
    }
  }

  const onEscPress = (e) => {
    var code = e.which;
    if (code === 27) {  
      onClearCustomEyeTrackingSampleSize(); 
    }
  }

  const renderHeader = () => {
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
        return (
          <>
            <Heading4
              $fontSizeMobile={"16px"}
              $colorName="--eerie-black"
              translation-key="target_how_many_respondents_eye_tracking_title"
            >
              {t('target_how_many_respondents_eye_tracking_title', { step: 2 })}
            </Heading4>
            <ParagraphBody $colorName="--gray-80" mt={1} translation-key="target_how_many_respondents_eye_tracking_sub_title">
              {t('target_how_many_respondents_eye_tracking_sub_title', { minEyeTrackingSampeSize: minEyeTrackingSampeSize })}
            </ParagraphBody>
          </>
        )
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        return (
          <>
            <Heading4
              $fontSizeMobile={"16px"}
              $colorName="--eerie-black"
              translation-key="target_how_many_respondents_emotion_measurement"
            >
              {t('target_how_many_respondents_emotion_measurement', { step: 2 })}

              
            </Heading4>
            <ParagraphBody $colorName="--gray-80" mt={1} translation-key="target_how_many_respondents_emotion_measurement_sub_title">
            {t('target_how_many_respondents_emotion_measurement_sub_title', { number: minEyeTrackingSampeSize })}
            </ParagraphBody>
          </>
        )
    }
  }

  return (
    <Grid mt={4} id={TARGET_SECTION.EYE_TRACKING_SAMPLE_SIZE}>
      {renderHeader()}
      <Grid mt={2}>
        <Grid className={classes.customSizeBox}>
          {listEyeTrackingSampleSize?.map((item, index) => (
            <Badge key={index} color="secondary" invisible={!item.popular} variant="dot" classes={{ dot: classes.badge }}>
              <ChipCustom
                clickable
                disabled={!editable}
                label={item.value}
                selected={item.value === project?.eyeTrackingSampleSize}
                variant={item.value === project?.eyeTrackingSampleSize ? "outlined" : "filled"}
                onClick={() => updateEyeTrackingSampleSize(item.value)}
              />
            </Badge>
          ))}
          {showCustomEyeTrackingSampleSize ? (
            <Grid className={classes.customSizeInputBox} component="form" onSubmit={handleSubmitESS(_onSubmitESS)} autoComplete="off" noValidate>
              <InputTextfield
                fullWidth
                autoFocus
                type="number"
                placeholder={t('target_sample_size_placeholder')}
                translation-key-placeholder="target_sample_size_placeholder"
                inputRef={registerESS("eyeTrackingSampleSize")}
                onKeyDown={onEscPress}
              />
              {isValidESS ? (
                <Button
                  type="submit"
                  btnType={BtnType.Outlined}
                  className={classes.btnSize}
                  children={<TextBtnSmall translation-key="common_save">{t("common_save")}</TextBtnSmall>}
                  startIcon={<Save />}
                />
              ) : (
                <Button
                  btnType={BtnType.Outlined}
                  className={classes.btnSize}
                  onClick={onClearCustomEyeTrackingSampleSize}
                  children={<TextBtnSmall translation-key="common_cancel">{t('common_cancel')}</TextBtnSmall>}
                />
              )}
            </Grid>
          ) : (
            isCustomEyeTrackingSampleSize ? (
              <ChipCustom
                selected
                disabled={!editable}
                label={project?.eyeTrackingSampleSize || "0"}
                variant="outlined"
                deleteIcon={<Edit />}
                onDelete={onCustomEyeTrackingSampleSize}
              />
            ) : (
              <ChipCustom
                clickable
                variant="filled"
                disabled={!editable}
                label={t('target_sample_size_custom')}
                translation-key="target_sample_size_custom"
                onClick={onCustomEyeTrackingSampleSize}
              />
            )
          )}
        </Grid>
        {(errorsESS.eyeTrackingSampleSize && showCustomEyeTrackingSampleSize) && <ParagraphSmall mt={1} $colorName="--red-error">{errorsESS.eyeTrackingSampleSize?.message}</ParagraphSmall>}
      </Grid>
    </Grid>
  )
})

export default ChooseEyeTrackingSampleSize