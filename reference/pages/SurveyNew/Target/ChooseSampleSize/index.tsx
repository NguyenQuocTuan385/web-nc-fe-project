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
import { CustomSampleSizeForm, _listSampleSize } from "../models";
import classes from '.././styles.module.scss';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ProjectService } from "services/project";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { setProjectReducer } from "redux/reducers/Project/actionTypes";
import InputTextfield from "components/common/inputs/InputTextfield";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import PopupConfirmChangeSampleSize, { DataConfirmChangeSampleSize } from "pages/SurveyNew/components/PopupConfirmChangeSampleSize";
import { ESOLUTION_TYPE } from "models";


interface Props {
  projectId: number;
  editable: boolean;
}

export const ChooseSampleSize = memo(({ projectId, editable }: Props) => {

  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()

  const { project } = useSelector((state: ReducerType) => state.project)

  const [showCustomSampleSize, setShowCustomSampleSize] = useState(false);
  const [confirmChangeSampleSizeData, setConfirmChangeSampleSizeData] = useState<DataConfirmChangeSampleSize>();

  const eyeTrackingSampleSizeConstConfig = useMemo(() => {
    return PriceService.getEyeTrackingSampleSizeConstConfig(project)
  }, [project])

  const minEyeTrackingSampeSize = useMemo(() => {
    return _.minBy(eyeTrackingSampleSizeConstConfig, 'limit')?.limit || 0
  }, [eyeTrackingSampleSizeConstConfig])

  const sampleSizeConstConfig = useMemo(() => {
    return PriceService.getSampleSizeConstConfig(project)
  }, [project])

  const maxSampeSize = useMemo(() => {
    return _.maxBy(sampleSizeConstConfig, 'limit')?.limit || 0
  }, [sampleSizeConstConfig])

  const minSampeSize = useMemo(() => {
    return _.minBy(sampleSizeConstConfig, 'limit')?.limit || 0
  }, [sampleSizeConstConfig])

  const isValidSampSize = (data: number) => {
    return data >= minSampeSize && data <= maxSampeSize
  }

  const listSampleSize = useMemo(() => {
    let listSampleSizeTemp = _listSampleSize.filter(it => isValidSampSize(it.value))
    return listSampleSizeTemp.sort((a, b) => a.value - b.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minSampeSize, maxSampeSize])


  const schemaSS = useMemo(() => {
    return yup.object().shape({
      sampleSize: yup.number()
        .typeError(t('target_sample_size_required'))
        .required(t('target_sample_size_required'))
        .min(minSampeSize, t('target_sample_size_min', { number: minSampeSize }))
        .max(maxSampeSize, t('target_sample_size_max', { number: maxSampeSize }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, minSampeSize, maxSampeSize])

  const {
    handleSubmit: handleSubmitSS,
    formState: { errors: errorsSS, isValid: isValidSS },
    reset: resetSS,
    register: registerSS,
  } = useForm<CustomSampleSizeForm>({
    resolver: yupResolver(schemaSS),
    mode: 'onChange'
  });

  const isCustomSampleSize = useMemo(() => {
    return project?.sampleSize && !listSampleSize.find(it => it.value === project.sampleSize)
  }, [project, listSampleSize])

  const onClearCustomSampleSize = () => {
    setShowCustomSampleSize(false)
    resetSS({ sampleSize: undefined })
  }

  const serviceUpdateSampleSize = (sampleSize: number) => {
    dispatch(setLoading(true))
    ProjectService.updateSampleSize(projectId, sampleSize)
      .then((res) => {
        dispatch(setProjectReducer({ ...project, sampleSize: sampleSize, eyeTrackingSampleSize: res.data.eyeTrackingSampleSize }))
        dispatch(setSuccessMess(res.message))
        onClearCustomSampleSize()
        onCloseConfirmChangeSampleSize()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const updateSampleSize = async (newSampleSize: number) => {
    if (!isValidSampSize(newSampleSize) || newSampleSize === project?.sampleSize || !editable) {
      onClearCustomSampleSize()
      return
    }
    dispatch(setLoading(true))
    const quotas = await ProjectService.getQuota(projectId)
      .catch(e => {
        dispatch(setErrorMess(e))
        return []
      })
    dispatch(setLoading(false))
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
      case ESOLUTION_TYPE.PRICE_TEST:
        if (quotas?.length) {
          setConfirmChangeSampleSizeData({
            newSampleSize: newSampleSize,
            isConfirmQuotas: true,
          })
        } else {
          serviceUpdateSampleSize(newSampleSize)
        }
        break;
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        if (quotas?.length || newSampleSize < project.eyeTrackingSampleSize) {
          setConfirmChangeSampleSizeData({
            newSampleSize: newSampleSize,
            isConfirmQuotas: !!quotas?.length,
            isConfirmEyeTrackingSampleSize: newSampleSize < project.eyeTrackingSampleSize,
            newEyeTrackingSampleSize: minEyeTrackingSampeSize,
            oldEyeTrackingSampleSize: project.eyeTrackingSampleSize || 0
          })
        } else {
          serviceUpdateSampleSize(newSampleSize)
        }
        break;
    }
  }

  const onCloseConfirmChangeSampleSize = () => {
    setConfirmChangeSampleSizeData(undefined)
  }

  const onConfirmedChangeSamleSize = () => {
    if (!confirmChangeSampleSizeData || !editable) return
    ProjectService.resetQuota(projectId)
      .then((res) => {
        dispatch(setProjectReducer({ ...project, agreeQuota: res.data.agreeQuota }))
        serviceUpdateSampleSize(confirmChangeSampleSizeData.newSampleSize)
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => onCloseConfirmChangeSampleSize())
  }

  const _onSubmitSS = (data: CustomSampleSizeForm) => {
    updateSampleSize(data.sampleSize)
  }

  const onCustomSampleSize = () => {
    if (!editable) return
    setShowCustomSampleSize(true)
    if (isCustomSampleSize) {
      resetSS({ sampleSize: project?.sampleSize || 0 })
    }
  }

  const onEscPress = (e) => {
    var code = e.which;
    if (code === 27) {  
      onClearCustomSampleSize(); 
    }
  }

  return (
    <Grid id={TARGET_SECTION.SAMPLE_SIZE}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        translation-key="target_how_many_respondents_target_title"
      >
        {t('target_how_many_respondents_target_title', { step: 1 })}
      </Heading4>
      <ParagraphBody $colorName="--gray-80" mt={1} translation-key="target_how_many_respondents_target_sub_title">
        {t('target_how_many_respondents_target_sub_title')}
      </ParagraphBody>
      <Grid mt={2}>
        <Grid className={classes.customSizeBox}>
          {listSampleSize?.map((item, index) => (
            <Badge key={index} color="secondary" invisible={!item.popular} variant="dot" classes={{ dot: classes.badge }}>
              <ChipCustom
                clickable
                disabled={!editable}
                label={item.value}
                selected={item.value === project?.sampleSize}
                variant={item.value === project?.sampleSize ? "outlined" : "filled"}
                onClick={() => updateSampleSize(item.value)}
              />
            </Badge>
          ))}
          {showCustomSampleSize ? (
            <Grid className={classes.customSizeInputBox} component="form" onSubmit={handleSubmitSS(_onSubmitSS)} autoComplete="off" noValidate>
              <InputTextfield
                fullWidth
                autoFocus
                type="number"
                placeholder={t('target_sample_size_placeholder')}
                translation-key-placeholder="target_sample_size_placeholder"
                inputRef={registerSS('sampleSize')}
                onKeyDown={onEscPress}
              />
              {isValidSS ? (
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
                  onClick={onClearCustomSampleSize}
                  children={<TextBtnSmall translation-key="common_cancel">{t('common_cancel')}</TextBtnSmall>}
                />
              )}
            </Grid>
          ) : (
            isCustomSampleSize ? (
              <ChipCustom
                selected
                disabled={!editable}
                label={project?.sampleSize || "0"}
                variant="outlined"
                deleteIcon={<Edit />}
                onDelete={onCustomSampleSize}             
              />
            ) : (
              <ChipCustom
                clickable
                variant="filled"
                disabled={!editable}
                label={t('target_sample_size_custom')}
                translation-key="target_sample_size_custom"
                onClick={onCustomSampleSize}
              />
            )
          )}
        </Grid>
        {(errorsSS.sampleSize && showCustomSampleSize) && <ParagraphSmall mt={1} $colorName="--red-error">{errorsSS.sampleSize?.message}</ParagraphSmall>}
        <Grid className={classes.popularSampleSize} translation-key="target_sample_size_popular"><span className={classes.iconPopular}></span>{t('target_sample_size_popular')}</Grid>
      </Grid>
      <PopupConfirmChangeSampleSize
        data={confirmChangeSampleSizeData}
        onClose={onCloseConfirmChangeSampleSize}
        onConfirm={onConfirmedChangeSamleSize}
      />
    </Grid>
  )
})

export default ChooseSampleSize