import { Box, Grid, Paper, TableBody, Menu, MenuItem, TableCell, TableHead, TableRow, Tooltip, Typography, IconButton } from "@mui/material"
import { Project } from "models/project"
import { memo, useMemo, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes"
import { TableCustom } from ".."
import classes from './styles.module.scss'
import clsx from "clsx"
import moment from "moment"
import { PaymentScheduleStatus as EPaymentScheduleStatus } from "models/payment_schedule";
import PaymentScheduleStatus from "components/PaymentScheduleStatus"
import { EditOutlined, ExpandMoreOutlined, Check as CheckIcon, Close, DeleteOutlineOutlined, Check } from "@mui/icons-material";
import { AdminProjectResultService } from 'services/admin/project_result';
import { FileUpload } from "models/attachment";
import Buttons from 'components/Buttons';
import ProjectHelper from "helpers/project"
import { ProjectResult } from "models/Admin/project_result";
import PopupAddEditProjectResult from "./components/PopupAddEditResult"
import WarningModal from "components/Modal/WarningModal";
import TotalResultForm from "./components/TotalResult"

export interface Props {
    project?: Project,
}


const ResultTab = memo(({ project }: Props) => {

    const dispatch = useDispatch()

    const [resultList, setResultList] = useState<ProjectResult[]>([])
    const [itemAction, setItemAction] = useState<ProjectResult>();
    const [itemDelete, setItemDelete] = useState<ProjectResult>(null);
    const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
    const [isOpenEditCreateResultPopUp, setIsOpenEditCreateResultPopUp] = useState<boolean>(false)

    const handleAction = (
        event: React.MouseEvent<HTMLButtonElement>,
        item: ProjectResult
    ) => {
        setItemAction(item)
        setActionAnchor(event.currentTarget);
    };

    const onCloseActionMenu = () => {
        setItemAction(null);
        setActionAnchor(null);
    };

    const onClosePopupAddEditProjectResult = () => {
        onCloseActionMenu()
        setIsOpenEditCreateResultPopUp(false)
    }

    const onSubmitAddEditProjectResult = (data: FormData, itemId?: number) => {
        dispatch(setLoading(true))
        if (itemId) {
            AdminProjectResultService.updateResult(itemId, data)
                .then(async () => {
                    await getProjectResult()
                })
                .catch((e) => dispatch(setErrorMess(e)))
                .finally(() => dispatch(setLoading(false)))
        }
        else {
            AdminProjectResultService.createResult(data)
                .then(async () => {
                    await getProjectResult()
                })
                .catch((e) => dispatch(setErrorMess(e)))
                .finally(() => dispatch(setLoading(false)))
        }
    }

    const getProjectResult = async () => {
        dispatch(setLoading(true))
        await AdminProjectResultService.getProjectResult({
            projectId: Number(project.id)
        })
            .then((projectResults) => setResultList(projectResults))
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    useEffect(() => {
        getProjectResult()
    }, [dispatch])

    const handleCreateResult = () => {
        onCloseActionMenu()
        setIsOpenEditCreateResultPopUp(true)
    }

    const handleEditResult = () => {
        setIsOpenEditCreateResultPopUp(true)
    }

    const onCloseConfirm = () => {
        if (!itemDelete) return
        setItemDelete(null)
        onCloseActionMenu()
    };

    const onDelete = () => {
        if (!itemAction) return
        dispatch(setLoading(true))
        AdminProjectResultService.deleteResult(itemAction.id)
            .then(async () => {
                onCloseConfirm()
                await getProjectResult()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const onShowConfirm = () => {
        if (!itemAction) return
        setItemDelete(itemAction)
    }

    const handleUpdateStatus = () => {
        if (!itemAction) return
        dispatch(setLoading(true))
        AdminProjectResultService.updateStatusReady(itemAction.id)
            .then(async () => {
                onCloseActionMenu()
                await getProjectResult()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    return (
        <>
            <Box>
                <Box>
                    <Typography variant="h6" mt={2} mb={2}>
                        Total Result
                    </Typography>

                    <TotalResultForm project={project} />
                </Box>
                <Box>
                    <Typography variant="h6" mt={2} mb={2}>
                        Results
                        <Box display="flex" alignContent="center" justifyContent="flex-end">
                            <Buttons btnType='Blue' children="Add a result" padding='11px 16px' onClick={handleCreateResult} />
                        </Box>
                    </Typography>
                    <TableCustom>
                        <TableHead>
                            <TableRow>
                                <TableCell>Month</TableCell>
                                <TableCell>Data Studio</TableCell>
                                <TableCell>Report</TableCell>
                                <TableCell>Report replaced</TableCell>
                                <TableCell>Data Studio replaced</TableCell>
                                <TableCell>Is Ready ?</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resultList.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{moment(item.month).format("MMM yyyy").toUpperCase()}</TableCell>
                                    <TableCell>{item.dataStudio ? <CheckIcon /> : <Close />}</TableCell>
                                    <TableCell>{item.report ? <CheckIcon /> : <Close />}</TableCell>
                                    <TableCell>{item.isReplacedReport ? <CheckIcon /> : <Close />}</TableCell>
                                    <TableCell>{item.isReplacedDataStudio ? <CheckIcon /> : <Close />}</TableCell>
                                    <TableCell>{item.isReady ? <CheckIcon /> : <Close />}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            className={clsx(classes.actionButton, {
                                                [classes.actionButtonActive]: item.id === itemAction?.id
                                            })}
                                            color="primary"
                                            onClick={(event) => {
                                                handleAction(event, item);
                                            }}
                                        >
                                            <ExpandMoreOutlined />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableCustom>
                </Box>
            </Box>
            <Menu
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                anchorEl={actionAnchor}
                keepMounted
                open={Boolean(actionAnchor)}
                onClose={onCloseActionMenu}
            >
                {
                    !itemAction?.isReady && (
                        <MenuItem
                            sx={{ fontSize: '0.875rem' }}
                            onClick={handleUpdateStatus}
                        >
                            <Box display="flex" alignItems={"center"}>
                                <Check sx={{ marginRight: '0.25rem' }} fontSize="small" />
                                <span>Mark result ready</span>
                            </Box>
                        </MenuItem>
                    )
                }
                <MenuItem
                    sx={{ fontSize: '0.875rem' }}
                    onClick={handleEditResult}
                >
                    <Box display="flex" alignItems={"center"}>
                        <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                        <span>Edit</span>
                    </Box>
                </MenuItem>
                <MenuItem
                    sx={{ fontSize: '0.875rem' }}
                    onClick={onShowConfirm}
                >
                    <Box display="flex" alignItems={"center"}>
                        <DeleteOutlineOutlined sx={{ marginRight: '0.25rem' }} color="error" fontSize="small" />
                        <span>Delete</span>
                    </Box>
                </MenuItem>
            </Menu>
            <PopupAddEditProjectResult
                isOpen={isOpenEditCreateResultPopUp}
                onClose={onClosePopupAddEditProjectResult}
                onSubmit={onSubmitAddEditProjectResult}
                itemEdit={itemAction}
                project={project}
            />
            <WarningModal
                title="Confirm"
                isOpen={!!itemDelete}
                onClose={onCloseConfirm}
                onYes={onDelete}
            >
                Are you sure?
            </WarningModal>
        </>
    )
})

export default ResultTab