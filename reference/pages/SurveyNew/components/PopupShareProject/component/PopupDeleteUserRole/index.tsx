import { Box, Dialog } from "@mui/material";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import { memo } from "react";
import classes from './styles.module.scss';
import { useTranslation } from "react-i18next";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import { DialogActionsConfirm } from "components/common/dialogs/DialogActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import HelpIcon from '@mui/icons-material/Help';
import { ProjectUser } from "models/project_user";
import Heading5 from "components/common/text/Heading5";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";

interface Props {
    isOpen: boolean,
    onCancel: () => void,
    projectUser: ProjectUser,
    handleRemoveAccess: (item: ProjectUser) => void,
}

const PopupDeleteUserRole = memo((props: Props) => {
    const { user } = useSelector((state: ReducerType) => state.user)
    const { isOpen, onCancel, projectUser, handleRemoveAccess } = props;
    const { t } = useTranslation()

    const _onCancel = () => {
        onCancel();
    };
    
    const _onDelete = () => {
        handleRemoveAccess(projectUser);
        onCancel();
    }

    return (
        <Dialog
            scroll="paper"
            open={isOpen}
            onClose={_onCancel}
            classes={{ paper: classes.paper }}
        >
            <DialogTitleConfirm>
                <Box display="flex">
                    <HelpIcon
                        sx={{ fontSize: 32, color: "var(--warning)", mr: 2 }}
                    />
                    <Heading3
                        $colorName="--cimigo-blue-dark-3"
                        translation-key="project_share_mgmt_confirm_delete_user"
                    >
                        {t("project_share_mgmt_confirm_delete_user")}
                    </Heading3>
                </Box>
                <ButtonClose
                    $backgroundColor="--eerie-black-5"
                    $colorName="--eerie-black-40"
                    onClick={_onCancel}
                />
            </DialogTitleConfirm>
            <DialogContentConfirm dividers>
                {projectUser?.userId === user.id ? (
                    <Heading5
                        $colorName="--gray-80"
                        $fontWeight={400}
                        className={classes.description}
                        translation-key="project_share_mgmt_confirm_delete_yourself_description"
                        dangerouslySetInnerHTML={{
                            __html: t("project_share_mgmt_confirm_delete_yourself_description", {
                                userName: "yourself"
                            }),
                        }}
                    />
                ) : (
                    <Heading5
                        $colorName="--gray-80"
                        $fontWeight={400}
                        className={classes.description}
                        translation-key="project_share_mgmt_confirm_delete_description"
                        dangerouslySetInnerHTML={{
                            __html: t("project_share_mgmt_confirm_delete_description", {
                                userName: projectUser?.user?.fullName || projectUser?.email
                            }),
                        }}
                    />
                )}
            </DialogContentConfirm>
            <DialogActionsConfirm>
                <Button
                    btnType={BtnType.Secondary}
                    onClick={_onCancel}
                >
                    <TextBtnSmall  translation-key="common_cancel">{t("common_cancel")}</TextBtnSmall>
                </Button>
                <Button
                    btnType={BtnType.Primary}
                    translation-key="common_remove"
                    children={<TextBtnSmall>{t("common_remove")}</TextBtnSmall>}
                    type="submit"
                    onClick={_onDelete}
                />
            </DialogActionsConfirm>
        </Dialog>
    );
})
export default PopupDeleteUserRole;