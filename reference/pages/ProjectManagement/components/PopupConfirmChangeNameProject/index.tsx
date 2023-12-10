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
import { Project } from "models/project";
import { memo, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextfield from "components/common/inputs/InputTextfield";

export interface RenameProjectFormData {
  name: string;
}

interface PopupConfirmChangeNameProjecProps {
  project: Project;
  onCancel: () => void;
  onSubmit: (data: RenameProjectFormData) => void;
}

const PopupConfirmChangeNameProject = memo(
  (props: PopupConfirmChangeNameProjecProps) => {
    const { t, i18n } = useTranslation();

    const schema = useMemo(() => {
      return yup.object().shape({
        name: yup.string().required(t("field_project_name_vali_required")),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const { onCancel, onSubmit, project } = props;

    const {
      register,
      formState: { errors },
      handleSubmit,
      reset,
    } = useForm<RenameProjectFormData>({
      resolver: yupResolver(schema),
      mode: "onChange",
    });

    useEffect(() => {
      if (project) {
        reset({
          name: project.name,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project]);

    const _onCancel = () => {
      onCancel();
      reset();
    };

    const _onSubmit = (data: RenameProjectFormData) => {
      onSubmit(data);
    };

    return (
      <Dialog
        scroll="paper"
        open={!!project}
        onClose={_onCancel}
        classes={{ paper: classes.paper }}
      >
        <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
          <DialogTitleConfirm>
            <Box display="flex">
              <Heading3
                $colorName="--cimigo-blue-dark-3"
                translation-key="project_mgmt_rename_title"
              >
                {t("project_mgmt_rename_title")}
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
              translation-key="project_mgmt_description_rename_project"
              dangerouslySetInnerHTML={{
                __html: t("project_mgmt_description_rename_project", {
                  projectName: project?.name,
                }),
              }}
            ></ParagraphBody>
            <InputTextfield
              titleRequired
              name="name"
              type="text"
              placeholder={t("field_project_name_placeholder")}
              translation-key-placeholder="field_project_name_placeholder"
              translation-key="field_project_name"
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
              translation-key="project_mgmt_action_rename"
              children={<TextBtnSmall>{t("project_mgmt_action_rename")}</TextBtnSmall>}
              type="submit"
            />
          </DialogActionsConfirm>
        </form>
      </Dialog>
    );
  }
);
export default PopupConfirmChangeNameProject;
