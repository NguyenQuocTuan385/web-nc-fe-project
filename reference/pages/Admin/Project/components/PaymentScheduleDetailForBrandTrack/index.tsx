import { Box, Grid, Button, TableBody, Menu, MenuItem, TableCell, TableHead, TableRow, Tooltip, Typography, IconButton } from "@mui/material"
import { Project } from "models/project"
import { memo, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes"
import { TableCustom } from ".."
import classes from './styles.module.scss'
import clsx from "clsx"
import moment from "moment"
import { PaymentScheduleStatus as EPaymentScheduleStatus } from "models/payment_schedule";
import PaymentScheduleStatus from "components/PaymentScheduleStatus"
import { fCurrencyVND, fCurrency } from "utils/formatNumber";
import { PaymentSchedule } from "models/payment_schedule"
import { EditOutlined, ExpandMoreOutlined, Check, Email, FileDownload } from "@mui/icons-material";
import PopupEditPaymentSchedule from "./components/PopupEditPaymentSchedule"
import PopupUploadInvoice from "./components/PopupUploadInvoice"
import PopupRestartPaymentSchedule from "./components/PopupRestartPaymentSchedule"
import { AdminPaymentScheduleService } from 'services/admin/payment_schedule';
import { AdminProjectService } from 'services/admin/project';
import { FileUpload } from "models/attachment";
import Buttons from 'components/Buttons';
import ProjectHelper from "helpers/project"
import ExcelJS from "exceljs";
import { DataPagination, OptionItemT, paymentMethods, TableHeaderLabel } from "models/general";
import { worksheetCols } from "./model";
import FileSaver from "file-saver";

export interface Props {
    project?: Project,
    reloadProjectInfo?: () => Promise<void>
}

interface PaymentScheduleForm {
    amount: number;
    dueDate: Date;
}

interface UploadInvoiceForm {
    invoice: FileUpload;
}

interface RestartScheduleForm {
    paymentSchedules: {
        dueDate: Date,
        start: Date
        end: Date,
        amount: number,
    }[],
}

const PaymentScheduleDetailForBrandTrack = memo(({ project, reloadProjectInfo }: Props) => {

    const dispatch = useDispatch()
    const [paymentScheduleList, setPaymentScheduleList] = useState<PaymentSchedule[]>([])
    const [itemAction, setItemAction] = useState<PaymentSchedule>();
    const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
    const [isOpenEditPaymentSchedulePopup, setIsOpenEditPaymentSchedulePopup] = useState<boolean>(false)
    const [isOpenUploadInvoicePopup, setIsOpenUploadInvoicePopup] = useState<boolean>(false)
    const [isOpenRestartPaymentSchedulePopup, setIsOpenRestartPaymentSchedulePopup] = useState<boolean>(false)

    const getPaymentSchedules = async () => {
        await AdminProjectService.getPaymentSchedule(Number(project.id))
            .then((paymentSchedules) => setPaymentScheduleList(paymentSchedules))
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    useEffect(() => {
        dispatch(setLoading(true));
        getPaymentSchedules()
    }, [dispatch])

    const onCloseActionMenu = () => {
        setItemAction(null);
        setActionAnchor(null);
    };

    const onClosePopupEditPaymentSchedule = () => {
        onCloseActionMenu()
        setIsOpenEditPaymentSchedulePopup(false)
    }

    const onClosePopupRestartPaymentSchedule = () => {
        setIsOpenRestartPaymentSchedulePopup(false)
    }

    const handleEdit = () => {
        if (!itemAction) return
        setIsOpenEditPaymentSchedulePopup(true)
    }

    const onClosePopupUploadInvoice = () => {
        onCloseActionMenu()
        setIsOpenUploadInvoicePopup(false)
    }

    const handleUploadInvoice = () => {
        if (!itemAction) return
        setIsOpenUploadInvoicePopup(true)
    }

    const handleRestartPaymentSchedule = () => {
        setIsOpenRestartPaymentSchedulePopup(true)
    }

    const handleAction = (
        event: React.MouseEvent<HTMLButtonElement>,
        item: PaymentSchedule
    ) => {
        setItemAction(item)
        setActionAnchor(event.currentTarget);
    };

    const onSubmitEditPaymentSchedule = (data: PaymentScheduleForm) => {
        dispatch(setLoading(true));
        AdminPaymentScheduleService.updateBasicInfo(itemAction.id, data)
            .then(async () => {
                await getPaymentSchedules()
                onClosePopupEditPaymentSchedule()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const onSubmitUploadInvoice = (data: FormData) => {
        dispatch(setLoading(true));
        AdminPaymentScheduleService.uploadInvoice(itemAction.id, data)
            .then(async () => {
                await getPaymentSchedules()
                onClosePopupUploadInvoice()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const handleUpdateStatus = () => {
        dispatch(setLoading(true));
        AdminPaymentScheduleService.updatePaidStatus(itemAction.id)
            .then(async () => {
                await getPaymentSchedules()
                onCloseActionMenu()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const handleSendInvoiceReadyEmail = () => {
        dispatch(setLoading(true));
        AdminPaymentScheduleService.sendInvoiceReadyEmail(itemAction.id)
            .then(async () => {
                dispatch(setSuccessMess("Send email successfully"))
                onClosePopupUploadInvoice()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const onSubmitRestartPaymentSchedule = (data: RestartScheduleForm) => {
        dispatch(setLoading(true));
        AdminPaymentScheduleService.restartPaymentSchedule({
            projectId: project.id,
            paymentSchedules: data.paymentSchedules
        })
            .then(async (res) => {
                dispatch(setSuccessMess("Restart payment schedule successfully"))
                await getPaymentSchedules()
                await reloadProjectInfo()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const _getCellData = (paymentSchedule, key): string | number => {
        switch (key) {
            case "start":
            case "end":
                return moment(paymentSchedule[key]).format("MM-YYYY");
            case "sampleSizeCostPerMonth":
            case "customQuestionCostPerMonth":
            case "vat":
            case "totalAmount":
            case "sampleSizeCostPerMonthUSD":
            case "customQuestionCostPerMonthUSD":
            case "vatUSD":
            case "totalAmountUSD":
                return paymentSchedule[key] ?? 0;
            case "createdAt":
            case "dueDate":
                return paymentSchedule[key] ? moment(paymentSchedule[key]).format("DD-MM-YYYY HH:mm") : "";
            case "payment.paymentMethodId":
                if (paymentSchedule?.payments?.length) {
                    key = key.split(".")[1];
                    return paymentMethods.find(
                        (method) => method.id === paymentSchedule.payments[0][key]
                    )?.name;
                }
                return ""
            case "payment.completedDate":
                if (paymentSchedule?.payments?.length) {
                    key = key.split(".")[1];
                    return paymentSchedule.payments[0][key] ? moment(paymentSchedule.payments[0][key]).format("DD-MM-YYYY HH:mm") : "";
                }
                return ""
            case "payment.orderId":
                if (paymentSchedule?.payments?.length) {
                    key = key.split(".")[1];
                    return paymentSchedule.payments[0][key];
                }
                return ""
            case "systemConfig.usdToVND":
                key = key.split(".")[1];
                return paymentSchedule.systemConfig[key] ?? 0;
            case "systemConfig.vat":
                key = key.split(".")[1];
                return `${((paymentSchedule.systemConfig[key] ?? 0) * 100)}%`;
            default:
                return paymentSchedule[key];
        }
    }

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.created = new Date();
        const worksheet = workbook.addWorksheet(
            `Payment schedules ${moment().format("DD-MM-YYYY")}`,
            {}
        );
        worksheet.addRow(worksheetCols.map((col) => col.header));

        try {
            paymentScheduleList.forEach(async (payment) => {
                const row: (string | number)[] = [];
                worksheetCols.forEach(({ key }) => {
                    row.push(_getCellData(payment, key) ?? "");
                });
                worksheet.addRow(row);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const filedata: Blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
            FileSaver.saveAs(filedata, `Payment schedules project ${project.name} ${moment().format("DD-MM-YYYY HH:mm")}.xlsx`);
        } catch (err) {
            dispatch(setErrorMess(err));
        }
    };

    return (
        <Box>
            {(!!paymentScheduleList?.length) && (
                <>
                    {
                        ProjectHelper.isCancelProject(project) && (
                            <Buttons btnType='Blue' children="Restart payment schedules" padding='11px 16px' onClick={handleRestartPaymentSchedule} />
                        )
                    }
                    <Box display="flex" justifyContent="space-between" mt={4} mb={2}>
                        <Typography variant="h6">
                            Payment Schedules
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleExportExcel}
                            startIcon={<FileDownload />}
                        >
                            Export
                        </Button>
                    </Box>
                    <Box ml={2}>
                        <TableCustom>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Start</TableCell>
                                    <TableCell>End</TableCell>
                                    <TableCell>Due Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>VAT</TableCell>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>USD to VND</TableCell>
                                    <TableCell>Payment ref</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paymentScheduleList.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{moment(item.start).format("MMM yyyy").toUpperCase()}</TableCell>
                                        <TableCell>{moment(item.end).format("MMM yyyy").toUpperCase()}</TableCell>
                                        <TableCell>{moment(item.dueDate).format("MMMM DD, yyyy")}</TableCell>
                                        <TableCell><PaymentScheduleStatus status={item.status} /></TableCell>
                                        <TableCell>{fCurrencyVND(item.amount)} ({fCurrency(item.totalAmountUSD)})</TableCell>
                                        <TableCell>{fCurrencyVND(item.vat)} ({fCurrency(item.vatUSD)})</TableCell>
                                        <TableCell>{fCurrencyVND(item.totalAmount)} ({fCurrency(item.totalAmountUSD)})</TableCell>
                                        <TableCell>{fCurrencyVND(item.systemConfig.usdToVND)}</TableCell>
                                        <TableCell>{item?.payments?.length ? item.payments[0].orderId : null}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                disabled={Boolean([EPaymentScheduleStatus.CANCEL, EPaymentScheduleStatus.OVERDUE].includes(item?.status))}
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
                            [EPaymentScheduleStatus.NOT_PAID].includes(itemAction?.status) && (
                                <MenuItem
                                    sx={{ fontSize: '0.875rem' }}
                                    onClick={handleEdit}
                                >
                                    <Box display="flex" alignItems={"center"}>
                                        <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                                        <span>Edit</span>
                                    </Box>
                                </MenuItem>
                            )
                        }
                        {
                            itemAction?.status === EPaymentScheduleStatus.IN_PROGRESS && (
                                <MenuItem
                                    sx={{ fontSize: '0.875rem' }}
                                    onClick={handleUpdateStatus}
                                >
                                    <Box display="flex" alignItems={"center"}>
                                        <Check sx={{ marginRight: '0.25rem' }} fontSize="small" />
                                        <span>Mark as paid</span>
                                    </Box>
                                </MenuItem>
                            )
                        }
                        {
                            itemAction?.status === EPaymentScheduleStatus.PAID && (
                                <Grid>
                                    <MenuItem
                                        sx={{ fontSize: '0.875rem' }}
                                        onClick={handleUploadInvoice}
                                    >
                                        <Box display="flex" alignItems={"center"}>
                                            <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                                            <span>Upload invoice</span>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem
                                        sx={{ fontSize: '0.875rem' }}
                                        onClick={handleSendInvoiceReadyEmail}
                                    >
                                        <Box display="flex" alignItems={"center"}>
                                            <Email sx={{ marginRight: '0.25rem' }} fontSize="small" />
                                            <span>Send email invoice ready</span>
                                        </Box>
                                    </MenuItem>
                                </Grid>
                            )
                        }
                    </Menu>
                    <PopupEditPaymentSchedule
                        isOpen={isOpenEditPaymentSchedulePopup}
                        onClose={onClosePopupEditPaymentSchedule}
                        paymentSchedule={itemAction}
                        onSubmit={onSubmitEditPaymentSchedule}
                    />
                    <PopupUploadInvoice
                        isOpen={isOpenUploadInvoicePopup}
                        onClose={onClosePopupUploadInvoice}
                        paymentSchedule={itemAction}
                        onSubmit={onSubmitUploadInvoice}
                    />
                    <PopupRestartPaymentSchedule
                        isOpen={isOpenRestartPaymentSchedulePopup}
                        onClose={onClosePopupRestartPaymentSchedule}
                        onSubmit={onSubmitRestartPaymentSchedule}
                        project={project}
                    />
                </>
            )}
        </Box>
    )
})

export default PaymentScheduleDetailForBrandTrack