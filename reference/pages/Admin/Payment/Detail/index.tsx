import { ArrowBackOutlined, EditOutlined, FileDownload } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import PaymentStatus from "components/PaymentStatus";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import { paymentMethods, TableHeaderLabel } from "models/general";
import { Payment, paymentStatuses } from "models/payment";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import { AdminPaymentService } from "services/admin/payment";
import { fCurrencyVND, fCurrency } from "utils/formatNumber";
import FileSaver from "file-saver";
import ExcelJS from "exceljs";
import classes from "./styles.module.scss";

const tableHeaders: TableHeaderLabel[] = [
  { name: 'orderId', label: 'Order ID', sortable: false },
  { name: 'merchTxnRef', label: 'Merch Txn Ref', sortable: false },
  { name: 'orderInfo', label: 'Order Info', sortable: false },
  { name: 'amount', label: 'Amount', sortable: false },
  { name: 'ticketNo', label: 'Ticket No', sortable: false },
  { name: 'status', label: 'Status', sortable: false },
  { name: 'response', label: 'Response', sortable: false },
  { name: 'createdTime', label: 'Created Time', sortable: false },
  { name: 'completedTime', label: 'Completed Time', sortable: false },
];

interface Props { }

// eslint-disable-next-line no-empty-pattern
const Detail = memo(({ }: Props) => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<Payment>(null);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true));
        AdminPaymentService.getPayment(Number(id))
          .then((res) => {
            setPayment(res);
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)));
      };
      fetchData();
    }
  }, [id, dispatch]);

  const handleBack = () => {
    dispatch(push(routes.admin.payment.root));
  };

  const getPaymentMethod = (item: Payment) => {
    return paymentMethods.find(it => it.id === item.paymentMethodId)?.name
  };

  const formatDate = (date: Date): string => {
    return date ? moment(date).format("DD-MM-YYYY HH:mm") : "";
  }

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet("Payment details");
    worksheet.addRow(tableHeaders.map((header) => header.label));

    payment.onepays.forEach((item) => {
      const row: (string | number)[] = [];
      tableHeaders.forEach(({ name }) => {
        switch (name) {
          case "orderId": row.push(item.userPaymentId ?? ""); break;
          case "merchTxnRef": row.push(item.vpc_MerchTxnRef || ""); break;
          case "orderInfo": row.push(item.vpc_OrderInfo || ""); break;
          case "amount": row.push(parseInt(item.amount || "0")); break;
          case "ticketNo": row.push(item.vpc_TicketNo || ""); break;
          case "status": row.push(paymentStatuses.find((status) => status.id === item.status)?.name || ""); break;
          case "response": row.push(JSON.stringify(item.rawCallback || "")); break;
          case "createdTime": row.push(formatDate(item.createdAt)); break;
          case "completedTime": row.push(formatDate(item.completedDate)); break;
        }
      });
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const filedata: Blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    FileSaver.saveAs(filedata, `Order ${id} payment details ${moment().format("DD-MM-YYYY HH:mm")}.xlsx`);
  };

  const onRedirectEdit = () => {
    if (!payment) return
    dispatch(push(routes.admin.payment.edit.replace(':id', `${payment.id}`)));
  }

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignContent="center"
        mb={4}
      >
        <Typography component="h2" variant="h6" align="left">
          Order Detail
        </Typography>
        <Box display="flex" alignContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            startIcon={<ArrowBackOutlined />}
          >
            Back
          </Button>
          {payment && (
            <Button
              sx={{ marginLeft: 2 }}
              variant="contained"
              color="primary"
              onClick={onRedirectEdit}
              startIcon={<EditOutlined />}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          {payment && (
            <>
              <Card elevation={3}>
                <CardContent sx={{ minHeight: "800px" }}>
                  <Box display="flex" flexDirection="column">
                    <Box px={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Typography my={2} variant="h6">Order</Typography>
                      <Grid container spacing={2} ml={0} width="100%">
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>ID:</span> {payment.id ?? ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Status:</span> <PaymentStatus status={payment.status} /></Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Payment Method:</span> {getPaymentMethod(payment) || ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>USD To VND Rate:</span> <span className={classes.valueBox}>{fCurrencyVND(payment.usdToVNDRate || 0)}</span></Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Sample Size Cost - VND:</span> <span className={classes.valueBox}>{fCurrencyVND(payment.sampleSizeCost || 0)}</span></Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Sample Size Cost - USD:</span> <span className={classes.valueBox}>{fCurrency(payment.sampleSizeCostUSD || 0)}</span></Typography></Grid>
                        {!!payment?.customQuestions?.length && (
                          <>
                            <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Custom Question Cost - VND:</span> <span className={classes.valueBox}>{fCurrencyVND(payment.customQuestionCost || 0)}</span></Typography></Grid>
                            <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Custom Question Cost - USD:</span> <span className={classes.valueBox}>{fCurrency(payment.customQuestionCostUSD || 0)}</span></Typography></Grid>
                          </>
                        )}
                        {!!payment?.eyeTrackingSampleSize && (
                          <>
                            <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Eye Tracking Cost - VND:</span> <span className={classes.valueBox}>{fCurrencyVND(payment.eyeTrackingSampleSizeCost || 0)}</span></Typography></Grid>
                            <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Eye Tracking Cost - USD:</span> <span className={classes.valueBox}>{fCurrency(payment.eyeTrackingSampleSizeCostUSD || 0)}</span></Typography></Grid>
                          </>
                        )}
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Subtotal - VND:</span> <span className={classes.valueBox}>{fCurrencyVND((payment.amount))}</span></Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Subtotal - USD:</span> <span className={classes.valueBox}>{fCurrency((payment.amountUSD))}</span></Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>VAT - VND:</span> <span className={classes.valueBox}>{fCurrencyVND(payment.vat || 0)}</span></Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>VAT - USD:</span> <span className={classes.valueBox}>{fCurrency(payment.vatUSD || 0)}</span></Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Total Amount - VND:</span> <span className={classes.valueBox}>{fCurrencyVND(payment.totalAmount || 0)}</span></Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Total Amount - USD:</span> <span className={classes.valueBox}>{fCurrency(payment.totalAmountUSD || 0)}</span></Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>VAT Rate:</span> {payment.vatRate * 100 || 0}%</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Created Time:</span> {payment.createdAt && moment(payment.createdAt).format("DD-MM-YYYY HH:ss")}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Completed Time:</span> {payment.completedDate && moment(payment.completedDate).format("DD-MM-YYYY HH:ss")}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Cancel Time:</span> {payment.cancelledDate && moment(payment.cancelledDate).format("DD-MM-YYYY HH:ss")}</Typography></Grid>
                        {
                          payment.schedule && <>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Start Date:</span>{moment(payment.schedule.start).format("DD-MM-YYYY HH:ss")}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography mb={2} variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>End Date:</span>{moment(payment.schedule.end).format("DD-MM-YYYY HH:ss")}</Typography></Grid>
                          </>
                        }
                      </Grid>
                    </Box>
                    <Box px={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Typography my={2} variant="h6">User</Typography>
                      <Grid container spacing={2} ml={0} width="100%">
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>ID:</span> {payment.user?.id ?? ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Fullname:</span> {payment.user?.fullName || ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Email:</span> {payment.user?.email || ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography mb={2} variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Phone:</span> {payment.user?.phone || ""}</Typography></Grid>
                      </Grid>
                    </Box>
                    <Box px={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Typography my={2} variant="h6">Project</Typography>
                      <Grid container spacing={2} ml={0} width="100%">
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>ID:</span> {payment.project?.id ?? ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography mb={2} variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Name:</span> {payment.project?.name || ""}</Typography></Grid>
                      </Grid>
                    </Box>
                    <Box px={3}>
                      <Typography my={2} variant="h6">Invoice</Typography>
                      <Grid container spacing={2} ml={0} width="100%">
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Fullname:</span> {payment.fullName || ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Company Name:</span> {payment.companyName || ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Company Address:</span> {payment.companyAddress || ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Email:</span> {payment.email || ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Phone:</span> {payment.phone || ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Country:</span> {payment.country?.name || ""}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography mb={2} variant="subtitle1" sx={{ fontWeight: 500 }}><span className={classes.subtitle}>Tax Code:</span> {payment.taxCode || ""}</Typography></Grid>
                      </Grid>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              {!!payment.onepays?.length && (
                <>
                  <Box marginTop={5} textAlign="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleExportExcel}
                      startIcon={<FileDownload />}
                    >
                      Export
                    </Button>
                  </Box>
                  <Card elevation={3} sx={{ marginTop: "30px" }}>
                    <CardContent sx={{ overflowX: "auto" }}>
                      <Table>
                        <TableHeader headers={tableHeaders} />
                        <TableBody>
                          {payment.onepays.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.userPaymentId ?? ""}</TableCell>
                              <TableCell>{item.vpc_MerchTxnRef || ""}</TableCell>
                              <TableCell>{item.vpc_OrderInfo || ""}</TableCell>
                              <TableCell>{fCurrencyVND(Number(item.amount || "0"))}</TableCell>
                              <TableCell>{item.vpc_TicketNo || ""}</TableCell>
                              <TableCell><PaymentStatus status={item.status} /></TableCell>
                              <TableCell sx={{ maxWidth: "300px", wordWrap: "break-word" }}>{JSON.stringify(item.rawCallback || "")}</TableCell>
                              <TableCell>{item.createdAt && moment(item.createdAt).format("DD-MM-YYYY HH:ss")}</TableCell>
                              <TableCell>{item.completedDate && moment(item.completedDate).format("DD-MM-YYYY HH:ss")}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
});

export default Detail;
