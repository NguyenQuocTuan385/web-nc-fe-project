import { Box, Grid, TableBody, Menu, MenuItem, TableCell, TableHead, TableRow, IconButton, Divider } from "@mui/material"
import { Project } from "models/project"
import { useMemo, memo, useState } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes"
import { TableCustom } from ".."
import classes from './styles.module.scss'
import InputTag, { schemaEmail } from "components/InputTag"
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { BtnType } from 'components/common/buttons/Button';
import { Check, ArrowDropDown } from '@mui/icons-material';
import ParagraphExtraSmall from 'components/common/text/ParagraphExtraSmall';
import BodySmall from "components/common/text/BodySmall";
import ErrorMessage from 'components/Inputs/components/ErrorMessage';
import { ProjectUser, EProjectRole, getProjectRole, projectRoles } from "models/project_user";
import usePermissions from 'hooks/usePermissions';
import { AdminProjectUserService } from "services/admin/project_users"

export interface Props {
    project?: Project,
    reloadProjectInfo?: () => Promise<void>
}

interface DataForm {
    emails: string[];
    email: string;
}


const ProjectUsersTab = memo(({ project, reloadProjectInfo }: Props) => {
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
    }, []);

    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
        control
    } = useForm<DataForm>({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const { listProjectUsers } = usePermissions(project)

    const [selectProjectRole, setSelectProjectRole] = useState<EProjectRole>(EProjectRole.RESULT_VIEWER)
    const [selectProjectRoleAnchor, setSelectProjectRoleAnchor] = useState<null | HTMLElement>(null);

    const onSubmit = (data: DataForm) => {
        dispatch(setLoading(true));
        const emails = [...(data.emails || [])]
        if (schemaEmail.isValidSync(data.email) && !!data.email) emails.push(data.email);
        AdminProjectUserService.sendEmailInviteProject({
            emails,
            projectRoleId: selectProjectRole,
            projectId: project.id
        })
            .then(() => {
                dispatch(setSuccessMess("Send email successfully"));
                reset({
                    emails: [],
                    email: '',
                })
                reloadProjectInfo()
            })
            .catch((error) => dispatch(setErrorMess(error)))
            .finally(() => dispatch(setLoading(false)))
    }

    const handleChooseRole = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        setSelectProjectRoleAnchor(event.currentTarget);
    };

    const chooseProjectRole = (id) => {
        setSelectProjectRole(id)
        setSelectProjectRoleAnchor(null);
    }

    const onCloseChooseRoleMenu = () => {
        setSelectProjectRole(EProjectRole.RESULT_VIEWER);
        setSelectProjectRoleAnchor(null);
    }

    const [itemAction, setItemAction] = useState<ProjectUser>();
    const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

    const handleAction = (
        event: React.MouseEvent<HTMLButtonElement>,
        item: ProjectUser
    ) => {
        setItemAction(item)
        setActionAnchor(event.currentTarget);
    };

    const onCloseActionMenu = () => {
        setItemAction(null);
        setActionAnchor(null);
    }

    const handleUpdateRole = (projectRole: EProjectRole) => {
        if (itemAction) {
            dispatch(setLoading(true));
            AdminProjectUserService.updateProjectRole({
                projectUserId: itemAction.id,
                projectRoleId: projectRole
            })
                .then(() => {
                    reloadProjectInfo();
                    onCloseActionMenu();
                })
                .catch((error) => dispatch(setErrorMess(error)))
                .finally(() => dispatch(setLoading(false)))
        }
    }

    const handleResendEmail = () => {
        if (itemAction) {
            dispatch(setLoading(true));
            AdminProjectUserService.resendProjectInvitationEmail({
                projectUserId: itemAction.id,
                projectId: itemAction.projectId
            })
                .then(() => {
                    onCloseActionMenu();
                    dispatch(setSuccessMess("Resend email successfully"));
                })
                .catch((error) => dispatch(setErrorMess(error)))
                .finally(() => dispatch(setLoading(false)))
        }
    }

    const handleRemoveAccess = () => {
        if (itemAction) {
            dispatch(setLoading(true));
            AdminProjectUserService.removeAccess(itemAction.id)
                .then(() => {
                    reloadProjectInfo();
                    onCloseActionMenu();
                })
                .catch((error) => dispatch(setErrorMess(error)))
                .finally(() => dispatch(setLoading(false)))
        }
    }

    return (
        <Box>
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
                        placeholder={"Add people, emails..."}
                    />

                    <IconButton className={classes.updateRole} onClick={(e) => handleChooseRole(e)}>
                        <ParagraphExtraSmall $colorName="--gray-80">{getProjectRole(selectProjectRole)?.name}</ParagraphExtraSmall>
                        <ArrowDropDown />
                    </IconButton>
                </Box>

                <Button
                    type="submit"
                    btnType={BtnType.Primary}
                    className={classes.sendInviteBtn}
                    disabled={!isValid}
                >
                    <BodySmall $colorName="--gray-8">Send invite</BodySmall>
                </Button>
            </Grid>
            {
                errors.emails?.length && <ErrorMessage>One or some of your emails are invalid</ErrorMessage>
            }

            <TableCustom sx={{ marginTop: "24px" }}>
                <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listProjectUsers?.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className={classes.projectUserFullName}>
                                <Box>
                                    {
                                        item?.user?.avatar && (
                                            <img src={item?.user?.avatar} alt="avatar" />
                                        )
                                    }
                                </Box>
                                {
                                    item?.user?.fullName && <p>{item?.user?.fullName}</p>
                                }
                            </TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>
                                <IconButton
                                    className={classes.updateRole}
                                    onClick={(event) => handleAction(event, item)}>
                                    <BodySmall $colorName="--gray-90">{getProjectRole(item.projectRoleId)?.name}</BodySmall>
                                    <ArrowDropDown />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </TableCustom>

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
                            key={item.id}
                        >
                            <span className={classes.checkIcon}>{selectProjectRole === item.id && <Check />}</span>
                            <BodySmall $colorName="--gray-80" $fontWeight="400">{item.name}</BodySmall>
                        </MenuItem>
                    ))
                }
            </Menu>

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
                open={Boolean(actionAnchor)}
                anchorEl={actionAnchor}
                onClose={onCloseActionMenu}
                classes={{ paper: classes.actionMenu }}
            >
                <MenuItem
                    sx={{ padding: '10px 20px' }}
                    onClick={() => handleUpdateRole(EProjectRole.RESULT_VIEWER)}
                >
                    <span className={classes.checkIcon}>{itemAction?.projectRoleId === EProjectRole.RESULT_VIEWER && <Check />}</span>
                    <BodySmall $colorName="--gray-80" $fontWeight="400">Result viewer</BodySmall>
                </MenuItem>
                <MenuItem
                    sx={{ padding: '10px 20px' }}
                    onClick={() => handleUpdateRole(EProjectRole.EDITOR)}
                >
                    <span className={classes.checkIcon}>{itemAction?.projectRoleId === EProjectRole.EDITOR && <Check />}</span>
                    <BodySmall $colorName="--gray-80" $fontWeight="400">Editor</BodySmall>
                </MenuItem>
                <MenuItem
                    sx={{ padding: '10px 20px' }}
                    onClick={() => handleUpdateRole(EProjectRole.OWNER)}
                >
                    <span className={classes.checkIcon}>{itemAction?.projectRoleId === EProjectRole.OWNER && <Check />}</span>
                    <BodySmall $colorName="--gray-80" $fontWeight="400">Owner</BodySmall>
                </MenuItem>
                <Divider />
                <MenuItem
                    sx={{ padding: '10px 20px' }}
                    onClick={() => handleResendEmail()}
                >
                    <span className={classes.checkIcon}></span>
                    <BodySmall $colorName="--gray-80" $fontWeight="400">Resend email</BodySmall>
                </MenuItem>
                <MenuItem
                    sx={{ padding: '10px 20px' }}
                    onClick={() => handleRemoveAccess()}
                >
                    <span className={classes.checkIcon}></span>
                    <BodySmall $colorName="--cimigo-danger" $fontWeight="400">Remove access</BodySmall>
                </MenuItem>
            </Menu>
        </Box>
    )
})

export default ProjectUsersTab;