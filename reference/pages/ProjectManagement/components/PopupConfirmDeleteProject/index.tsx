import { memo, useMemo, useState } from "react";
import { Box, Dialog } from "@mui/material";
import classes from "./styles.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Project } from "models/project";
import { useTranslation } from "react-i18next";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import { DialogActionsConfirm } from "components/common/dialogs/DialogActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import ParagraphBody from "components/common/text/ParagraphBody";
import CancelIcon from "@mui/icons-material/Cancel";
import InputTextField from "components/common/inputs/InputTextfield";
import { reset } from "numeral";

interface DeleteForm {
  delete: string;
}
interface PopupConfirmDeleteProjectProps {
  project: Project;
  onCancel: () => void;
  onDelete: (projectId: number) => void;
}

const PopupConfirmDeleteProject = memo(
  (props: PopupConfirmDeleteProjectProps) => {
    const { t } = useTranslation();

    const { onCancel, onDelete, project } = props;

    const schema = useMemo(() => {
      return yup.object().shape({
        delete: yup.string()
          .required(t('project_mgmt_confirm_delete_type_delete_valid'))
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { register, reset, watch, handleSubmit, formState: { errors } } = useForm<DeleteForm>({
      resolver: yupResolver(schema),
      mode: 'onChange'
    });

    const clearForm = () => {
      reset({
        delete: "",
      });
    }
  
    const _onCancel = () => {
      onCancel();
      clearForm();
    };

    const isValid = () => watch("delete") === "DELETE"

    const _onDelete = () => {
      if (!project.id || !isValid()) return;
      onDelete(project.id);
      clearForm();
    };

    return (
      <Dialog
        scroll="paper"
        open={!!project}
        onClose={_onCancel}
        classes={{ paper: classes.paper }}
      >
        <form  onSubmit={handleSubmit(_onDelete)}>
          <DialogTitleConfirm>
            <Box display="flex">
              <CancelIcon
                sx={{ fontSize: 32, color: "var(--red-error)", mr: 2 }}
              />
              <Heading3
                $colorName="--cimigo-blue-dark-3"
                translation-key="project_mgmt_confirm_delete_title"
              >
                {t("project_mgmt_confirm_delete_title")}
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
              $colorName="--gray-80"
              className={classes.description}
              translation-key="project_mgmt_confirm_delete_sub_title"
              dangerouslySetInnerHTML={{
                __html: t("project_mgmt_confirm_delete_sub_title", {
                  projectName: project?.name,
                }),
              }}
            ></ParagraphBody>
            <ParagraphBody
              $colorName="--gray-80"
              className={classes.descriptionNoOperation}
              translation-key="project_mgmt_confirm_delete_sub_title_no_operation"
            >
            {t("project_mgmt_confirm_delete_sub_title_no_operation")}
            </ParagraphBody>
            <InputTextField
              title={t("project_mgmt_confirm_delete_type_delete")}
              autoComplete="off"

              inputRef={register("delete")}
              placeholder={t('project_mgmt_confirm_delete_type_delete_valid')}
              translation-key-placeholder="project_mgmt_confirm_delete_type_delete_valid"
              type="text"
              errorMessage={errors.delete?.message}
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
              btnType={BtnType.Primary}
              disabled={!isValid()}
              className={classes.buttonDelete}
              translation-key="project_mgmt_action_delete"
              children={<TextBtnSmall>{t("project_mgmt_action_delete")}</TextBtnSmall>}
              type="submit"
              // onClick={() => _onDelete()}
            />
          </DialogActionsConfirm>
        </form>
      </Dialog>
    );
  }
);
export default PopupConfirmDeleteProject;
