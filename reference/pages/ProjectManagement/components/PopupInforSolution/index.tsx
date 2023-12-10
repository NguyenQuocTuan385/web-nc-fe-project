import { memo } from "react";
import { Dialog } from "@mui/material";
import classes from "./styles.module.scss";

import { Solution } from "models/Admin/solution";
import { useTranslation } from "react-i18next";
import Heading3 from "components/common/text/Heading3";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Button, { BtnType } from "components/common/buttons/Button";
import ButtonClose from "components/common/buttons/ButtonClose";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";

interface PopupPopupInforSolution {
  solution: Solution;
  onCancel?: () => void;
  onSelect?: () => void;
}

const PopupInforSolution = memo((props: PopupPopupInforSolution) => {
  const { onCancel, solution, onSelect } = props;

  const { t } = useTranslation();

  return (
    <Dialog
      open={!!solution}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.header}>
        <Heading3 $colorName={"--ghost-white"}>{solution?.title}</Heading3>
        <ButtonClose
          $backgroundColor="--ghost-white"
          $colorName="--cimigo-blue-dark-1"
          onClick={onCancel}
        />
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: solution?.content || "" }}
        ></div>
      </DialogContent>
      <DialogActions className={classes.btnBox}>
        <Button
          fullWidth
          children={
            <TextBtnSecondary translation-key="project_create_tab_solution_get_started">
              {t("project_create_tab_solution_get_started")}
            </TextBtnSecondary>
          }
          btnType={BtnType.Primary}
          onClick={onSelect}
        />
      </DialogActions>
    </Dialog>
  );
});
export default PopupInforSolution;
