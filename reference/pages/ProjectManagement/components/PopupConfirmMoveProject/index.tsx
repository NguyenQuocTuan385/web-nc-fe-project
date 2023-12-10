import { memo, useEffect, useMemo, useState } from "react";
import { Box, Dialog } from "@mui/material";
import classes from "./styles.module.scss";
import { Folder } from "models/folder";
import { Project } from "models/project";
import InputSelect from "components/InputsSelect";
import { OptionItem } from "models/general";
import { useTranslation } from "react-i18next";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import { DialogActionsConfirm } from "components/common/dialogs/DialogActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import ParagraphBody from "components/common/text/ParagraphBody";

interface PopupConfirmMoveProjectProps {
  project: Project;
  folders: Folder[];
  onCancel: () => void;
  onMove: (data?: OptionItem) => void;
}

const PopupConfirmMoveProject = memo((props: PopupConfirmMoveProjectProps) => {
  const { t, i18n } = useTranslation();

  const { onCancel, onMove, project, folders } = props;

  const allOption: OptionItem = useMemo(() => {
    return { id: -1, name: t("project_mgmt_all_projects") };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const [itemSelected, setItemSelected] = useState<OptionItem>(null);
  const [options, setOptions] = useState<OptionItem[]>([]);

  const onChangeProject = (item: OptionItem) => {
    setItemSelected(item);
  };

  useEffect(() => {
    setItemSelected(
      project?.folder
        ? { id: project.folder.id, name: project.folder.name }
        : allOption
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    const _options: OptionItem[] =
      folders?.map((it) => ({ id: it.id, name: it.name })) || [];
    _options.unshift(allOption);
    setOptions(_options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folders]);

  const _onCancel = () => {
    onCancel();
  };

  const _onMove = () => {
    if (!itemSelected) return;
    if (itemSelected.id === -1) onMove();
    else onMove(itemSelected);
  };

  return (
    <Dialog
      scroll="paper"
      open={!!project}
      onClose={_onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitleConfirm>
        <Box display="flex">
          <Heading3
            $colorName="--cimigo-blue-dark-3"
            translation-key="project_mgmt_move_title"
          >
            {t("project_mgmt_move_title")}
          </Heading3>
        </Box>
        <ButtonClose
          $backgroundColor="--eerie-black-5"
          $colorName="--eerie-black-40"
          onClick={onCancel}
        />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody
          sx={{ padding: "0px 0px 16px 0px" }}
          $colorName="--gray-80"
          className={classes.description}
          translation-key="project_mgmt_description_move_project"
          dangerouslySetInnerHTML={{
            __html: t("project_mgmt_description_move_project", {
              projectName: project?.name,
            }),
          }}
        ></ParagraphBody>
        <InputSelect
          fullWidth
          name=""
          selectProps={{
            options: options,
            value: itemSelected,
            menuPosition: "fixed",
            placeholder: "",
            onChange: (val: any, _: any) => onChangeProject(val),
          }}
        />
      </DialogContentConfirm>
      <DialogActionsConfirm >
        <Button
          btnType={BtnType.Secondary}
          onClick={_onCancel}
          translation-key="common_cancel"
        >
          {t("common_cancel")}
        </Button>
        <Button
          btnType={BtnType.Raised}
          translation-key="project_mgmt_move_title"
          children={<TextBtnSmall>{t("project_mgmt_move_title")}</TextBtnSmall>}
          type="button"
          onClick={() => _onMove()}
        />
      </DialogActionsConfirm>
    </Dialog>
  );
});
export default PopupConfirmMoveProject;
