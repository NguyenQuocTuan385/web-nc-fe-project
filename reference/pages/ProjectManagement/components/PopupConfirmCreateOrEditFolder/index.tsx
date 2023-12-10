import { Box, Dialog } from "@mui/material";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import { DialogActionsConfirm } from "components/common/dialogs/DialogActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import ParagraphBody from "components/common/text/ParagraphBody";
import { memo, useEffect, useMemo } from "react";
import InputTextfield from "components/common/inputs/InputTextfield";
import { Folder } from "models/folder";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface RenameFolderFormData {
  name: string;
}
interface PopupConfirmCreateOrEditFolderProps {
  isOpen: boolean;
  folder?: Folder;
  onCancel: () => void;
  onSubmit: (name: string, id?: number) => void;
}

const PopupConfirmCreateOrEditFolder = memo(
  (props: PopupConfirmCreateOrEditFolderProps) => {
    const { t, i18n } = useTranslation();

    const { onCancel, onSubmit, folder, isOpen } = props;
    const schema = useMemo(() => {
      return yup.object().shape({
        name: yup
          .string()
          .required(t("field_project_name_vali_required"))
          .max(20, t("project_mgmt_field_folder_name_max")),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);
    const {
      register,
      formState: { errors },
      handleSubmit,
      reset,
    } = useForm<RenameFolderFormData>({
      resolver: yupResolver(schema),
      mode: "onChange",
    });

    useEffect(() => {
      if (folder) {
        reset({
          name: folder.name,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [folder]);

    const _onCancel = () => {
      reset({
        name: "",
      });
      onCancel();
    };
    const _onSubmit = (data: RenameFolderFormData) => {
      if (!data) return;
      onSubmit(data.name, folder?.id);
      reset({
        name: "",
      });
    };

    return (
      <Dialog
        scroll="paper"
        open={isOpen}
        onClose={_onCancel}
        classes={{ paper: classes.paper }}
      >
        <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
          <DialogTitleConfirm>
            <Box display="flex">
              <Heading3
                $colorName="--cimigo-blue-dark-3"
                translation-key={
                  folder
                    ? "project_mgmt_title_rename_folder"
                    : "project_mgmt_create_folder_btn"
                }
              >
                {folder
                  ? t("project_mgmt_title_rename_folder")
                  : t("project_mgmt_create_folder_btn")}
              </Heading3>
            </Box>
            <ButtonClose
              $backgroundColor="--eerie-black-5"
              $colorName="--eerie-black-40"
              onClick={_onCancel}
            />
          </DialogTitleConfirm>
          <DialogContentConfirm dividers>
            {!folder ? (
              <ParagraphBody
                $colorName="--gray-80"
                className={classes.description}
                translation-key="project_mgmt_description_create_folder"
              >
                {t("project_mgmt_description_create_folder")}
              </ParagraphBody>
            ) : (
              <ParagraphBody
                $colorName="--gray-80"
                className={classes.description}
                translation-key="project_mgmt_description_rename_folder"
                dangerouslySetInnerHTML={{
                  __html: t("project_mgmt_description_rename_folder", {
                    folderName: folder?.name,
                  }),
                }}
              ></ParagraphBody>
            )}
            <InputTextfield
              titleRequired
              sx={{ margin: "16px 0px" }}
              name="name"
              type="text"
              placeholder={t("project_mgmt_create_folder_placeholder")}
              translation-key-placeholder="project_mgmt_create_folder_placeholder"
              translation-key="project_mgmt_create_folder_placeholder"
              inputRef={register("name")}
              errorMessage={errors.name?.message}
            />
          </DialogContentConfirm>
          <DialogActionsConfirm>
            <Button
              btnType={BtnType.Secondary}
              onClick={_onCancel}
              translation-key="common_cancel"
            >
              {t("common_cancel")}
            </Button>
            <Button
              btnType={BtnType.Raised}
              translation-key={
                folder ? "project_mgmt_action_rename" : "common_save"
              }
              children={
                <TextBtnSmall>
                  {folder ? t("project_mgmt_action_rename") : t("common_save")}
                </TextBtnSmall>
              }
              type="submit"
            />
          </DialogActionsConfirm>
        </form>
      </Dialog>
    );
  }
);
export default PopupConfirmCreateOrEditFolder;
