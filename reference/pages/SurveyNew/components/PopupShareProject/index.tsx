import { memo, useState, useMemo } from 'react';
import { Box, Dialog, MenuItem, IconButton, Grid, Menu } from '@mui/material';
import classes from './styles.module.scss';
import { Check, ArrowDropDown } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DialogTitleConfirm } from 'components/common/dialogs/DialogTitle';
import { DialogContentConfirm } from 'components/common/dialogs/DialogContent';
import { DialogActionsConfirm } from 'components/common/dialogs/DialogActions';
import Heading4 from 'components/common/text/Heading4';
import Heading5 from 'components/common/text/Heading5';
import ParagraphExtraSmall from 'components/common/text/ParagraphExtraSmall';
import ButtonClose from 'components/common/buttons/ButtonClose';
import Button, { BtnType } from 'components/common/buttons/Button';
import ControlCheckbox from "components/common/control/ControlCheckbox";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import { ProjectUser, EProjectRole, getProjectRole, projectRoles } from "models/project_user";
import BodySmall from "components/common/text/BodySmall";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import InputTag, { schemaEmail } from "components/InputTag"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Project } from 'models/project';
import { ProjectUserService } from "services/project_user";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { ProjectService } from "services/project";
import { setProjectReducer } from "redux/reducers/Project/actionTypes";
import { routes } from 'routers/routes';
import ErrorMessage from 'components/Inputs/components/ErrorMessage';
import { push } from 'connected-react-router';
import usePermissions from 'hooks/usePermissions';
import { getProjectRolesRequest } from "redux/reducers/Project/actionTypes"
import React from 'react';
import ItemPeopleShare from './component/ItemPeopleShare';
import PopupDeleteUserRole from './component/PopupDeleteUserRole';

interface Props {
    isOpen: boolean,
    onCancel: () => void,
    project: Project,
}

interface DataForm {
    emails: string[];
    email: string,
}

const PopupShareProject = memo((props: Props) => {
    const { user } = useSelector((state: ReducerType) => state.user)
    const { isOpen, onCancel, project } = props;
    const { t, i18n } = useTranslation()

    const schema = useMemo(() => {
        return yup.object().shape({
            email: yup.string().notRequired(),
            emails: yup.array(yup.string().email().businessEmail())
                .when('email', {
                    is: (val: string) => yup.string().email().businessEmail().required().isValidSync(val),
                    then: (schema) => schema.min(0).notRequired(),
                    otherwise: (schema) => schema.min(1).required(),
                }),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const [selectProjectRoleAnchor, setSelectProjectRoleAnchor] = useState<null | HTMLElement>(null);

    const [selectProjectRole, setSelectProjectRole] = useState<EProjectRole>(EProjectRole.RESULT_VIEWER)

    const [projectUserDelete, setProjectUserDelete] = useState<ProjectUser>(null)

    const dispatch = useDispatch()

    const { listProjectUsers,
        currentProjectUser,
        isAllowInviteToProject,
        isDisabledInvite,
    } = usePermissions()

    const chooseProjectRole = (id) => {
        setSelectProjectRole(id)
        setSelectProjectRoleAnchor(null);
    }

    const {
        handleSubmit,
        formState: { errors, isValid },
        reset,
        control
    } = useForm<DataForm>({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const onSubmit = (data: DataForm) => {
        const emails = [...(data.emails || [])]
        if (schemaEmail.isValidSync(data.email) && !!data.email) emails.push(data.email);
        dispatch(setLoading(true));
        ProjectUserService.sendEmailInvitation({
            emails,
            projectRoleId: selectProjectRole,
            projectId: project.id
        })
            .then((res) => {
                dispatch(getProjectRolesRequest(project.id))
                reset({
                    emails: [],
                    email: '',
                })
            })
            .catch((err) => dispatch(setErrorMess(err)))
            .finally(() => dispatch(setLoading(false)))
    }

    const onTogglePermissionAndShare = (checked: boolean) => {
        dispatch(setLoading(true))
        ProjectService.updateProjectCanChangePermissionAndShare(project.id, { canChangePermissionAndShare: checked })
            .then((res) => {
                dispatch(setProjectReducer({
                    ...project,
                    canChangePermissionAndShare: res.canChangePermissionAndShare,
                }))
                dispatch(setSuccessMess(res.message))
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const handleUpdateRole = (projectRole: EProjectRole, itemAction: ProjectUser) => {
        if (itemAction) {
            dispatch(setLoading(true));
            ProjectUserService.updateRole({
                projectId: project.id,
                projectUserId: itemAction.id,
                projectRoleId: projectRole
            })
                .then(() => {
                    dispatch(setProjectReducer({
                        ...project,
                        projectUsers: project.projectUsers.map((item) => item.id === itemAction.id ? { ...item, projectRoleId: projectRole } : item)
                    }))
                })
                .catch((error) => dispatch(setErrorMess(error)))
                .finally(() => dispatch(setLoading(false)))
        }
    }

    const handleRemoveAccess = (itemAction: ProjectUser) => {
        if (itemAction) {
            dispatch(setLoading(true));
            ProjectUserService.removeAccess(itemAction.id, {
                projectId: project.id,
            })
                .then(() => {
                    if (itemAction.userId === user.id) {
                        dispatch(push(routes.project.management))
                    }
                    dispatch(setProjectReducer({
                        ...project,
                        projectUsers: project.projectUsers.filter((item) => item.id !== itemAction.id)
                    }))

                })
                .catch((error) => dispatch(setErrorMess(error)))
                .finally(() => dispatch(setLoading(false)))
        }
    }

    const handleResendEmail = (itemAction: ProjectUser) => {
        if (itemAction) {
            dispatch(setLoading(true));
            ProjectUserService.resendEmailInvitation({
                projectId: project.id,
                projectUserId: itemAction.id
            })
                .then(() => {
                    dispatch(setSuccessMess(t('project_share_resend_email_success')));
                })
                .catch((error) => dispatch(setErrorMess(error)))
                .finally(() => dispatch(setLoading(false)))
        }
    }

    const onCloseChooseRoleMenu = () => {
        setSelectProjectRole(EProjectRole.RESULT_VIEWER);
        setSelectProjectRoleAnchor(null);
    }

    const handleChooseRole = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        setSelectProjectRoleAnchor(event.currentTarget);
    };

    const openPopupDeleUserRole = (projectUser: ProjectUser) => {
        setProjectUserDelete(projectUser)
    }

    const onCancelPopupDeleteUserRole = () => {
        setProjectUserDelete(null)
    }

    return (
        <Dialog
            scroll="paper"
            open={isOpen}
            onClose={onCancel}
            classes={{ paper: classes.paper }}
        >
            <DialogTitleConfirm className={classes.dialogTitle}>
                <Box display="flex" alignItems="center">
                    <Heading4 $colorName='--gray-90' translation-key="project_share_setting">{t('project_share_setting')}</Heading4>
                </Box>
                <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onCancel} />
            </DialogTitleConfirm>
            <DialogContentConfirm dividers>
                {
                    !isDisabledInvite && (
                        <>
                            <Grid
                                noValidate
                                autoComplete="off"
                                onSubmit={handleSubmit(onSubmit)}
                                component={"form"}
                                className={classes.emailsShareContainer}
                            >
                                <Box className={classes.tagInputContainer}>
                                    <InputTag
                                        className={classes.inputTag}
                                        control={control}
                                        name="emails"
                                        nameText="email"
                                        placeholder={t("project_share_send_invite_placeholder")}
                                    />

                                    <IconButton className={classes.updateRole} onClick={(e) => handleChooseRole(e)} disabled={isDisabledInvite}>
                                        <ParagraphExtraSmall sx={{ marginRight: "12px" }} $colorName="--gray-80">{t(getProjectRole(selectProjectRole)?.translationKey)}</ParagraphExtraSmall>
                                        <ArrowDropDown />
                                    </IconButton>
                                </Box>
                                <Button
                                    type="submit"
                                    btnType={BtnType.Primary}
                                    className={classes.sendInviteBtn}
                                    disabled={!isValid || isDisabledInvite}
                                    translation-key="project_share_send_invite"
                                >
                                    <BodySmall $colorName="--gray-8">{t("project_share_send_invite")}</BodySmall>
                                </Button>
                            </Grid>
                            {
                                (errors.emails || errors.email) && <ErrorMessage translation-key="project_share_invalid_emails_list">{t('project_share_invalid_emails_list')}</ErrorMessage>
                            }
                        </>
                    )
                }
                <Heading5 sx={{ margin: "24px 0 16px 0" }}>{t("project_share_people_access")}</Heading5>
                <Box>
                    {
                        listProjectUsers?.map((projectUser, index) => (
                            <ItemPeopleShare
                                key={index}
                                projectUser={projectUser}
                                handleUpdateRole={handleUpdateRole}
                                handleResendEmail={handleResendEmail}
                                openPopupDeleUserRole={openPopupDeleUserRole}
                            />
                        ))
                    }
                </Box>

            </DialogContentConfirm>
            {
                [EProjectRole.OWNER].includes(currentProjectUser?.projectRoleId) && (
                    <DialogActionsConfirm className={classes.checkboxWrapper}>
                        <ControlCheckbox
                            className={classes.checkboxEditor}
                            $cleanPadding={true}
                            control={
                                <InputCheckbox
                                    checkboxColorType={"blue"}
                                    onChange={(_, checked) => onTogglePermissionAndShare(checked)}
                                    checked={!!project?.canChangePermissionAndShare}
                                />
                            }
                            translation-key="project_share_editor_can_change_permission_share"
                            label={t("project_share_editor_can_change_permission_share") as string}
                        />
                    </DialogActionsConfirm>
                )
            }
            <Menu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                open={Boolean(selectProjectRoleAnchor)}
                anchorEl={selectProjectRoleAnchor}
                onClose={onCloseChooseRoleMenu}
                classes={{ paper: classes.actionMenu }}
            >
                {
                    projectRoles.map((item) => (
                        <MenuItem
                            onClick={() => chooseProjectRole(item.id)}
                            sx={{ padding: '10px 20px' }}
                            disabled={!isAllowInviteToProject(item.id)}
                        >
                            <span className={classes.checkIcon}>{selectProjectRole === item.id && <Check />}</span>
                            <BodySmall $colorName="--gray-80" $fontWeight="400" translation-key={item.translationKey}>{t(item.translationKey)}</BodySmall>
                        </MenuItem>
                    ))
                }
            </Menu>
            <PopupDeleteUserRole
                isOpen={!!projectUserDelete}
                onCancel={onCancelPopupDeleteUserRole}
                projectUser={projectUserDelete}
                handleRemoveAccess={handleRemoveAccess}
            />
        </Dialog>
    )
})

export default PopupShareProject
