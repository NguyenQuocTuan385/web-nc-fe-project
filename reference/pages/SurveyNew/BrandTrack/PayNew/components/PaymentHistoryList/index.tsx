import { memo, useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { DataPagination } from "models/general";
import Heading4 from "components/common/text/Heading4";
import Grid from "@mui/material/Grid";
import { Box, TablePagination } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Heading5 from "components/common/text/Heading5";
import { PaymentScheduleHistory, GetListPaymentScheduleHistory } from "models/payment_schedule";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import IconMoneyCash from "components/icons/IconMoneyCash";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import ParagraphBody from "components/common/text/ParagraphBody";
import { PaymentScheduleService } from "services/payment_schedule";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import { usePrice } from "helpers/price";
import { PaymentService } from "services/payment";
import FileSaver from "file-saver";
import useDateTime from "hooks/useDateTime"

interface PaymentHistoryListProps {
    projectId: number;
}

const PaymentHistoryList = memo((props: PaymentHistoryListProps) => {
    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();

    const { projectId } = props;

    const [params, setParams] = useState<GetListPaymentScheduleHistory>({
        take: 10,
        page: 1,
        isDescending: true,
        projectId: projectId,
    });

    const [listPaymentHistory, setListPaymentHistory] =
        useState<DataPagination<PaymentScheduleHistory>>();

    const { getCostCurrency } = usePrice()

    useEffect(() => {
        const getPaymentHistory = async () => {
            dispatch(setLoading(true))
            await PaymentScheduleService.getListPaymentScheduleHistory(params)
                .then((res) => {
                    setListPaymentHistory(res);
                })
                .catch((e) => dispatch(setErrorMess(e)))
                .finally(() => dispatch(setLoading(false)));
        }
        getPaymentHistory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleChangePage = (
        _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        newPage: number
    ) => {
        setParams({ ...params, page: newPage + 1 });
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setParams({
            ...params,
            take: Number(event.target.value),
            page: 1,
        });
    };

    useEffect(() => {
        if (inValidPage()) {
            handleChangePage(null, listPaymentHistory.meta.page - 2);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listPaymentHistory]);

    const inValidPage = () => {
        if (!listPaymentHistory) return false;
        return (
            listPaymentHistory.meta.page > 1 &&
            Math.ceil(
                listPaymentHistory.meta.itemCount / listPaymentHistory.meta.take
            ) < listPaymentHistory.meta.page
        );
    };

    const pageIndex = useMemo(() => {
        if (!listPaymentHistory) return 0;
        if (inValidPage()) return listPaymentHistory.meta.page - 2;
        return listPaymentHistory.meta.page - 1;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listPaymentHistory]);

    const handleDownloadInvoice = (payment: PaymentScheduleHistory) => {
        dispatch(setLoading(true));
        PaymentService.getPaymentScheduleInvoice(payment.id)
            .then((res) => {
                FileSaver.saveAs(res.data, `invoice-${moment().format("MM-DD-YYYY-hh-mm-ss")}.pdf`);
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)));
    }

    const { formatFullDate, formatMonthYear } = useDateTime()
    
    return (
        <>
            {
                listPaymentHistory?.data?.length ? (
                    <Grid className={classes.paymentHistory}>
                        <Grid>
                            <Heading4 $fontWeight={"400"} $colorName={"--eerie-black"} translation-key="brand_track_your_next_payment_title_list_payment_history">
                                {t("brand_track_your_next_payment_title_list_payment_history")}
                            </Heading4>
                            <Grid className={classes.listPayemnt} pt={2}>
                                {listPaymentHistory.data.map((itemPaymentHistory) => (
                                    <Box
                                        className={classes.itemPayment}
                                        key={itemPaymentHistory.id}
                                    >
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} sm={8}>
                                                <Heading5 $colorName={"--gray-90"}>
                                                    {`${formatMonthYear(itemPaymentHistory.schedule.start)} - ${formatMonthYear(itemPaymentHistory.schedule.end)}`}
                                                </Heading5>
                                                <Grid className={classes.moneyAndDate} pt={1}>
                                                    <Grid className={classes.money} pr={2.5}>
                                                        <IconMoneyCash/>
                                                        <ParagraphBody variant="tabular_nums">
                                                        {getCostCurrency(itemPaymentHistory.totalAmount, itemPaymentHistory?.currency)?.show}
                                                        </ParagraphBody>
                                                    </Grid>
                                                    <Grid className={classes.date}>
                                                        <CalendarMonthOutlinedIcon sx={{color: "var(--gray-80)"}} />
                                                        <span>
                                                        {formatFullDate(itemPaymentHistory.completedDate)}
                                                        </span>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <ParagraphSmallUnderline2
                                                    className={classes.linkDownload}
                                                    translation-key="brand_track_your_next_payment_download_invoice"
                                                    onClick={() => handleDownloadInvoice(itemPaymentHistory)}
                                                >
                                                   {t("brand_track_your_next_payment_download_invoice")}
                                                </ParagraphSmallUnderline2>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid className={classes.pagination} pt={4}>
                            <TablePagination
                                labelRowsPerPage={t("common_row_per_page")}
                                labelDisplayedRows={function defaultLabelDisplayedRows({
                                    from,
                                    to,
                                    count,
                                }) {
                                    return t("common_row_of_page", {
                                        from: from,
                                        to: to,
                                        count: count,
                                    });
                                }}
                                component="div"
                                count={listPaymentHistory?.meta?.itemCount || 0}
                                rowsPerPage={listPaymentHistory?.meta?.take || 10}
                                page={pageIndex}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Grid className={classes.paymentHistory}>
                        <Heading4 $fontWeight={"400"} $colorName={"--gray-black"} translation-key="brand_track_your_next_payment_title_list_payment_history">
                            {t("brand_track_your_next_payment_title_list_payment_history")}
                        </Heading4>
                        <Grid className={classes.listPayemnt} pt={2}>
                            <Heading4
                                $fontWeight={"400"}
                                textAlign={"center"}
                                $colorName={"--gray-40"}
                                translation-key="brand_track_your_next_payment_list_payment_history_not_found"
                            >
                                {t("brand_track_your_next_payment_list_payment_history_not_found")}
                            </Heading4>
                        </Grid>
                    </Grid>
                )
            }
        </>
    )
})

export default PaymentHistoryList;