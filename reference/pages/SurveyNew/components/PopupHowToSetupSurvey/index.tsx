import { memo, useState, useMemo } from 'react';
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes"
import printJS from "print-js";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Dialog, Grid } from '@mui/material';
import Popover from '@mui/material/Popover';
import HelpIcon from '@mui/icons-material/Help';
import PrintIcon from '@mui/icons-material/Print';
import NearMeIcon from '@mui/icons-material/NearMe';
import ForwardToInboxTwoToneIcon from '@mui/icons-material/ForwardToInboxTwoTone';
import classes from './styles.module.scss';
import { Project } from 'models/project';
import { useTranslation } from 'react-i18next';
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import Heading3 from "components/common/text/Heading3";
import Heading2 from "components/common/text/Heading2";
import Heading5 from "components/common/text/Heading5";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import TextBtnSmall from 'components/common/text/TextBtnSmall';
import ButtonClose from "components/common/buttons/ButtonClose";
import InputTextField from "components/common/inputs/InputTextfield";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphBody from 'components/common/text/ParagraphBody';
import { AttachmentService } from 'services/attachment';
import { ProjectService } from 'services/project';
import clsx from 'clsx';
interface EmailForm {
  name: string,
  email: string,
}
interface Props {
  isOpen: boolean,
  project: Project,
  onClose: () => void,
}

const PopupHowToSetupSurvey = memo((props: Props) => {
  const { isOpen, project, onClose } = props;

  const dispatch = useDispatch()

  const { t, i18n } = useTranslation()

  const [anchorEl, setAnchorEl] = useState(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required(t("field_name_vali_required")),
      email: yup.string()
        .email(t("field_email_vali_email"))
        .required(t("field_email_vali_required")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const clearForm = () => {
    reset({
      name: "",
      email: ""
    })
  };

  const handleClosePopoverEmail = () => {
    setAnchorEl(null);
    clearForm();
  }

  const openMenuEmail = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const onPrint = () => {
    if (!project?.solution?.howToSetUpSurveyFileId) return
    dispatch(setLoading(true))
    AttachmentService.downloadBase64(project?.solution?.howToSetUpSurveyFileId)
      .then((res) => {
        printJS({ printable: res.data.data, type: 'pdf', base64: true})
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const _onClose = () => {
    onClose()
  }

  const _onSubmit = (data: EmailForm) => {
    dispatch(setLoading(true))
    ProjectService.sendEmailHowToSetupSurvey(project.id, data.name, data.email)
      .then(() => {
        dispatch(setSuccessMess(t("forgot_password_send_success")))
        handleClosePopoverEmail()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  };

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={_onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle>
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
          <HelpIcon sx={{ marginRight: '19px' }} />
          <Heading3 translation-key="">
            {project?.solution?.howToSetUpSurveyDialogTitle}
          </Heading3>
        </Grid>
        <ButtonClose onClick={onClose}>
        </ButtonClose>
      </DialogTitle>
      <DialogContent dividers>
        <Grid sx={{ paddingBottom: '24px' }}>
          <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px' }}>
            <Heading2 $colorName="--cimigo-blue">
              {project?.solution?.howToSetUpSurveyPageTitle}
            </Heading2>
            <Grid className={classes.iconContainer}>
              <div className={classes.iconAction} onClick={onPrint}>
                <PrintIcon />
              </div>
              <Grid>
                <div onClick={openMenuEmail} className={classes.iconAction}>
                  <ForwardToInboxTwoToneIcon />
                </div>
                <Popover
                  elevation={0}
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClosePopoverEmail}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  className={classes.memu}
                >
                  <Grid sx={{ maxWidth: '372px', padding: '16px' }} component="form" onSubmit={handleSubmit(_onSubmit)}>
                    <Heading5 translation-key="setup_survey_how_to_setup_send_email_title">{t("setup_survey_how_to_setup_send_email_title")}</Heading5>
                    <ParagraphSmall translate-key="setup_survey_how_to_setup_send_email_title_decs" sx={{marginBottom: '16px'}}>{t("setup_survey_how_to_setup_send_email_title_decs")}</ParagraphSmall>
                    <Grid container spacing={2} direction="column">
                      <Grid item>
                        <InputTextField
                          title={t("setup_survey_how_to_setup_name_recipient")}
                          translation-key-placeholder="setup_survey_how_to_setup_name_recipient_placeholder"
                          placeholder={t("setup_survey_how_to_setup_name_recipient_placeholder")}
                          autoFocus={true}
                          inputProps={{ tabIndex: 1 }}
                          type="text"
                          autoComplete="off"
                          inputRef={register('name')}
                          errorMessage={errors.name?.message}
                        />
                      </Grid>
                      <Grid item>
                        <InputTextField
                          title={t("setup_survey_how_to_setup_email_recipient")}
                          translation-key-placeholder="setup_survey_how_to_setup_email_recipient_placeholder"
                          placeholder={t("setup_survey_how_to_setup_email_recipient_placeholder")}
                          type="text"
                          inputProps={{ tabIndex: 2 }}
                          autoComplete="off"
                          inputRef={register('email')}
                          errorMessage={errors.email?.message}
                        />
                      </Grid>
                    </Grid>
                    <Grid sx={{ display: 'flex', justifyContent: 'start', marginTop: '16px' }}>
                      <Button btnType={BtnType.Primary} type="submit">
                        <NearMeIcon fontSize="small" sx={{ marginRight: '7px' }} />
                        <TextBtnSmall transition-key="common_send">{t("common_send")}</TextBtnSmall>
                      </Button>
                    </Grid>
                  </Grid>
                </Popover>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.contentContainer}>
            <ParagraphBody $colorName="--eerie-black" variant='body2' variantMapping={{ body2: "div" }} className={clsx("ql-editor", classes.contentText)} dangerouslySetInnerHTML={{ __html: project?.solution?.howToSetUpSurveyContent || '' }}></ParagraphBody>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
});
export default PopupHowToSetupSurvey;



