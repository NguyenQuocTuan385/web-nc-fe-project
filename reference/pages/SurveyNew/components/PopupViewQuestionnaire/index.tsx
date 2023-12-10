import { memo } from "react";
import { Dialog, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import ButtonClose from "components/common/buttons/ButtonClose";
import Heading4 from "components/common/text/Heading4";
import BodySmallSingleLine from "components/common/text/BodySmallSingleLine";
import { Project } from "models/project";
import UseAuth from "hooks/useAuth";

interface Props {
  isOpen: boolean;
  project: Project,
  onClose: () => void;
}

const PopupViewQuestionnaire = memo((props: Props) => {
  const { isOpen, project, onClose } = props;

  const {user} = UseAuth();

  const { t } = useTranslation();

  const _onClose = () => {
    onClose();
  };

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={_onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.headerPopup}>
        <Grid sx={{ display: "flex", alignItems: "center" }}>
          <Heading4 $colorName="--gray-90" translate-key="project_preview_questionnaire_title">{t('project_preview_questionnaire_title')}</Heading4>
        </Grid>
        <ButtonClose
          $backgroundColor="--gray-2"
          $colorName="--eerie-black-40"
          onClick={onClose}
        ></ButtonClose>
      </DialogTitle>
      <DialogContent dividers className={classes.contentPopup}>
        <Grid sx={{ height: 1 }}>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: 1
            }}
          >
            <iframe src={`${project?.solution?.previewQuestionnaireUrl}?solution_id=${project?.solution?.id}&project_id=${project?.id}&user_id=${user?.id}`} width={"100%"} height={"100%"} />
          </Grid>
        </Grid>
      </DialogContent>
      <div className={classes.footerPopup}>
        <BodySmallSingleLine $colorName="--gray-60" translate-key="project_preview_questionnaire_description">
          {t('project_preview_questionnaire_description')}
        </BodySmallSingleLine>
      </div>
    </Dialog>
  );
});
export default PopupViewQuestionnaire;