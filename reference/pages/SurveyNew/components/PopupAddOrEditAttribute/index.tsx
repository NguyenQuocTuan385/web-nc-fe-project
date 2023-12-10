import { memo, useEffect, useMemo } from 'react';
import { Dialog, Grid, ListItem, ListItemText, InputAdornment, Tooltip } from '@mui/material';
import classes from './styles.module.scss';
import { UserAttribute } from 'models/user_attribute';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { Project } from "models/project";
import InputTextField from 'components/common/inputs/InputTextfield';
import { useTranslation } from 'react-i18next';
import {DialogTitle} from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import Heading6 from "components/common/text/Heading6";
import ButtonClose from "components/common/buttons/ButtonClose";
import Button, {BtnType} from "components/common/buttons/Button";
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import ParagraphBody from 'components/common/text/ParagraphBody';
import Tip from 'components/icons/IconTip';
import ProjectHelper from 'helpers/project';


export interface UserAttributeFormData {
  content: string;
}


interface Props {
  isAdd?: boolean,
  itemEdit?: UserAttribute,
  project: Project;
  onCancel: () => void,
  onSubmit: (data: UserAttributeFormData) => void,
}

const PopupAddOrEditAttribute = memo((props: Props) => {
  const { isAdd, itemEdit, onCancel, project, onSubmit } = props;

  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      content: yup.string().required("This field is required"),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserAttributeFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const _onSubmit = (data: UserAttributeFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (!isAdd && !itemEdit) {
      reset({
        content: '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdd, itemEdit])

  useEffect(() => {
    if (itemEdit) {
      reset({
        content: itemEdit.content,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemEdit])

  const prefix_trans = useMemo(() => ProjectHelper.getPrefixTrans(project?.solution?.typeId), [project?.solution?.typeId])

  return (
    <Dialog
      scroll="paper"
      open={isAdd || !!itemEdit}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <form autoComplete="off" className={classes.form} noValidate onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle $backgroundColor="--white" className={classes.header}>
          {itemEdit ? (
            <Heading3 $colorName="--gray-90" translation-key={`${prefix_trans}_setup_survey_popup_edit_your_own_att_title`}>{t(`${prefix_trans}_setup_survey_popup_edit_your_own_att_title`)}</Heading3>
          ) : (
            <Heading3 $colorName="--gray-90" translation-key={`${prefix_trans}_setup_survey_popup_add_your_own_att_title`}>{t(`${prefix_trans}_setup_survey_popup_add_your_own_att_title`)}</Heading3>
          )}
          <ButtonClose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel}>
          </ButtonClose>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
          <ParagraphBody $colorName="--eerie-black" 
            translation-key={`${prefix_trans}_setup_survey_popup_your_own_att_sub_title`}
            dangerouslySetInnerHTML={{
              __html: t(`${prefix_trans}_setup_survey_popup_your_own_att_sub_title`),
            }}
          />
          <Grid container classes={{ root: classes.rootList }}>
            <ListItem
              alignItems="center"
              component="div"
              classes={{ root: classes.rootListItem }}
              disablePadding
            >
              <ListItemText>
                <Grid>
                  <Grid item>
                    <ParagraphBody $fontWeight="600" $colorName="--eerie-black" translation-key={`${prefix_trans}_setup_survey_popup_your_own_att_question`}>{t(`${prefix_trans}_setup_survey_popup_your_own_att_question`)}</ParagraphBody>
                    <ParagraphSmall $colorName="--eerie-black" className={classes.subInputTitle} translation-key={`${prefix_trans}_setup_survey_popup_your_own_att_input_label`}>{t(`${prefix_trans}_setup_survey_popup_your_own_att_input_label`)}</ParagraphSmall>
                    <InputTextField
                      className={classes.inputPoint}
                      name="content"
                      placeholder={t(`${prefix_trans}_setup_survey_popup_your_own_att_input_placeholder`)}
                      translation-key-placeholder={`${prefix_trans}_setup_survey_popup_your_own_att_input_placeholder`}
                      inputRef={register('content')}
                      startAdornment={
                        <InputAdornment position="start">
                          <Tooltip
                            translation-key={`${prefix_trans}_setup_survey_popup_your_own_att_question_tooltip_icon`}
                            title={t(`${prefix_trans}_setup_survey_popup_your_own_att_question_tooltip_icon`)}
                          >
                            <div className={classes.iconLanguage}>{project?.surveyLanguage}</div>
                          </Tooltip>
                        </InputAdornment>
                      }
                      errorMessage={errors.content?.message}
                    />
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          </Grid>
          <Grid className={classes.tips}>
            <Tip sx={{color: "var(--gray-60)", width: "14px", height: "20px", margin: "2px 5px 0 0"}}/>
            <div className={classes.border}/>
            <Grid className={classes.tipsDescription} > 
              <Heading6
                style={{
                  color: "var(--gray-80)",
                  marginLeft: "0px"
                }}
                $fontWeight="700"
                translation-key={`${prefix_trans}_setup_survey_popup_your_own_att_tip_title`}
              >
                {t(`${prefix_trans}_setup_survey_popup_your_own_att_tip_title`)}:
              </Heading6>
              <div>
                <ParagraphSmall className={classes.itemTip}><span className={classes.itemDotTip} translation-key={`${prefix_trans}_setup_survey_popup_your_own_att_tip_description_1`}>•</span>{t(`${prefix_trans}_setup_survey_popup_your_own_att_tip_description_1`)}</ParagraphSmall>
                <ParagraphSmall className={classes.itemTip}><span className={classes.itemDotTip} translation-key={`${prefix_trans}_setup_survey_popup_your_own_att_tip_description_2`}>•</span>{t(`${prefix_trans}_setup_survey_popup_your_own_att_tip_description_2`)}</ParagraphSmall>
                <ParagraphSmall className={classes.itemTip}><span className={classes.itemDotTip} translation-key={`${prefix_trans}_setup_survey_popup_your_own_att_tip_description_3`}>•</span>{t(`${prefix_trans}_setup_survey_popup_your_own_att_tip_description_3`)}</ParagraphSmall>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.btn}>
          <Button btnType={BtnType.Secondary} onClick={onCancel} translation-key="common_cancel">{t('common_cancel')}</Button>
          <Button
            type="submit"
            translation-key="common_save"
            children={t('common_save')}
            btnType={BtnType.Raised}
            className={classes.btnSave}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
});
export default PopupAddOrEditAttribute;
