import { EProjectRole, getProjectRole, ProjectUser } from "models/project_user";
import { memo, useState } from "react";
import clsx from 'clsx';
import classes from './styles.module.scss';
import Heading1 from "components/common/text/Heading1";
import Heading6 from "components/common/text/Heading6";
import BodySmall from "components/common/text/BodySmall";
import { Check, ArrowDropDown } from '@mui/icons-material';
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { Box, MenuItem, IconButton, Divider, Stack, Menu } from '@mui/material';
import React from "react";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { useTranslation } from "react-i18next";
import usePermissions from "hooks/usePermissions";
import BodySmallSingleLine from "components/common/text/BodySmallSingleLine";
interface ItemPeopleShareProps {
    projectUser: ProjectUser,
    handleUpdateRole: (role: EProjectRole, item: ProjectUser) => void,
    handleResendEmail: (item: ProjectUser) => void,
    openPopupDeleUserRole: (item: ProjectUser) => void,
}
const ItemPeopleShare = memo((itemPeopleShareProps: ItemPeopleShareProps) => {
    const { user } = useSelector((state: ReducerType) => state.user)
    const { t } = useTranslation();
    const {
        currentProjectUser,
        isAllowInviteToProject,
        isAllowUpdateRole,
        isAllowRemoveAccess,
    } = usePermissions()
    
    const { projectUser, handleUpdateRole, handleResendEmail, openPopupDeleUserRole } = itemPeopleShareProps;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(e.currentTarget);
    };

    const _handleResendEmail = () => {
        handleResendEmail(projectUser);
        setAnchorEl(null);
    }
    const _handleUpdateRole = (role: EProjectRole) => {
        handleUpdateRole(role, projectUser)
        setAnchorEl(null);
    }

    const _openPopupDeleUserRole = () => {
        openPopupDeleUserRole(projectUser);
        setAnchorEl(null);
    }

    return (
        <>
            <Stack direction={"row"} spacing={1} key={projectUser?.id} className={classes.userWrapper}>

                {
                    projectUser?.user?.avatar
                        ?
                        <Box className={classes.userImageWrapper}>
                            <img src={projectUser?.user?.avatar} alt="" className={classes.avatar} referrerPolicy="no-referrer" />
                        </Box>
                        :
                        <Box className={clsx(classes.userImageWrapper, classes.userFakeAvatar)}>
                            <Heading1 $colorName="--gray-60">{projectUser?.email.charAt(0)}</Heading1>
                        </Box>
                }
                <Box flex="1" display="flex" justifyContent="space-around" flexDirection="column" className={classes.userInfo}>
                    {
                        !!projectUser?.user?.fullName && <Heading6 className={classes.textFullName}>{projectUser?.user?.fullName} {projectUser?.userId === user.id && t("project_share_yourself")}</Heading6>
                    }
                    <ParagraphSmall className={classes.textEmail}>{projectUser?.email}</ParagraphSmall>
                </Box>
                <Box>
                    {
                        (([EProjectRole.RESULT_VIEWER, EProjectRole.EDITOR].includes(currentProjectUser?.projectRoleId) && currentProjectUser?.id !== projectUser?.id) || ([EProjectRole.OWNER].includes(projectUser?.projectRoleId) && [EProjectRole.EDITOR].includes(currentProjectUser?.projectRoleId)))
                            ? (
                                <IconButton
                                    className={classes.updateRole}
                                    disabled
                                >
                                    <BodySmallSingleLine $colorName="--gray-90">{t(getProjectRole(projectUser?.projectRoleId)?.translationKey)}</BodySmallSingleLine>
                                </IconButton>
                            ) : (
                                <IconButton
                                    className={classes.updateRole}
                                    onClick={(e) => handleClick(e)}
                                >
                                    <BodySmallSingleLine $colorName="--gray-90">{t(getProjectRole(projectUser?.projectRoleId)?.translationKey)}</BodySmallSingleLine>
                                    <ArrowDropDown />
                                </IconButton>
                            )
                    }

                </Box>
            </Stack>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {
                    isAllowUpdateRole(EProjectRole.RESULT_VIEWER, projectUser) && (
                        <MenuItem
                            sx={{ padding: '10px 20px' }}
                            onClick={() => _handleUpdateRole(EProjectRole.RESULT_VIEWER)}
                        >
                            <span className={classes.checkIcon}>{projectUser?.projectRoleId === EProjectRole.RESULT_VIEWER && <Check />}</span>
                            <BodySmall $colorName="--gray-80" $fontWeight="400" translation-key="project_role_result_viewer">{t("project_role_result_viewer")}</BodySmall>
                        </MenuItem>
                    )
                }
                {
                    isAllowUpdateRole(EProjectRole.EDITOR, projectUser) && (
                        <MenuItem
                            sx={{ padding: '10px 20px' }}
                            onClick={() => _handleUpdateRole(EProjectRole.EDITOR)}
                        >
                            <span className={classes.checkIcon}>{projectUser?.projectRoleId === EProjectRole.EDITOR && <Check />}</span>
                            <BodySmall $colorName="--gray-80" $fontWeight="400" translation-key={"project_role_editor"}>{t("project_role_editor")}</BodySmall>
                        </MenuItem>
                    )
                }
                {
                    isAllowUpdateRole(EProjectRole.OWNER, projectUser) && (
                        <MenuItem
                            sx={{ padding: '10px 20px' }}
                            onClick={() => _handleUpdateRole(EProjectRole.OWNER)}
                        >
                            <span className={classes.checkIcon}>{projectUser?.projectRoleId === EProjectRole.OWNER && <Check />}</span>
                            <BodySmall $colorName="--gray-80" $fontWeight="400" translation-key={"project_role_owner"}>{t("project_role_owner")}</BodySmall>
                        </MenuItem>
                    )
                }
                {
                    isAllowInviteToProject(projectUser?.projectRoleId) && projectUser?.userId !== user.id && <Divider />
                }
                {
                    isAllowInviteToProject(projectUser?.projectRoleId) && projectUser?.userId !== user.id ? (
                        <MenuItem
                            sx={{ padding: '10px 20px' }}
                            onClick={_handleResendEmail}
                        >
                            <span className={classes.checkIcon}></span>
                            <BodySmall $colorName="--gray-80" $fontWeight="400">{t("project_share_resend_invite")}</BodySmall>
                        </MenuItem>
                    )
                        :
                        null
                }
                {
                    isAllowRemoveAccess(projectUser) ? (
                        <MenuItem
                            sx={{ padding: '10px 20px' }}
                            onClick={_openPopupDeleUserRole}
                        >
                            {projectUser?.userId !== user.id ? (
                                <>
                                    <span className={classes.checkIcon}></span>
                                    <BodySmall $colorName="--cimigo-danger" $fontWeight="400">{t("project_share_remove_access")}</BodySmall>
                                </>
                            ) : (
                                <BodySmall $colorName="--cimigo-danger" $fontWeight="400">{t("project_share_remove_access")}</BodySmall>
                            )}
                        </MenuItem>
                    ) : null
                }
            </Menu>
        </>
    )
})
export default ItemPeopleShare;