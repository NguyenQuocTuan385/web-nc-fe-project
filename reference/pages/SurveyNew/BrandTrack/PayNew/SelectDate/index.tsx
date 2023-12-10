import { Box, Grid } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import Heading5 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import { memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import DoneIcon from "@mui/icons-material/Done";
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import Heading3 from "components/common/text/Heading3";
import { ReducerType } from "redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes, routesOutside } from "routers/routes";
import { useTranslation } from "react-i18next";
import Dolar from "components/icons/IconDolar";
import Footer from "components/Footer";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { PaymentScheduleService } from "services/payment_schedule";
import moment from "moment";
import PopupConfirmMakeAnOrder from "../components/PopupConfirmMakeAnOrder";
import { authPreviewOrSelectDate } from "../models";
import {
  GetPaymentSchedulePreview,
  PaymentSchedulePreview,
} from "models/payment_schedule";
import clsx from "clsx";
import { setPaymentIsMakeAnOrderSuccessReducer } from "redux/reducers/Payment/actionTypes";
import { usePrice } from "helpers/price";
import { getPaymentSchedulesRequest, setProjectReducer } from "redux/reducers/Project/actionTypes";
import { formatOrdinalumbers } from "utils/formatNumber";
import { Content, LeftContent, PageRoot } from "pages/SurveyNew/components";
import useDateTime from "hooks/useDateTime"
import usePermissions from "hooks/usePermissions";

export interface DateItem {
  id: number;
  date?: string;
}
interface SelectDateProps {
  projectId: number;
}
const SelectDate = memo(({ projectId }: SelectDateProps) => {
  const dispatch = useDispatch();

  const { project } = useSelector((state: ReducerType) => state.project);

  const { t, i18n } = useTranslation();

  const { getCostCurrency } = usePrice();

  const [listDate, setListDate] = useState<DateItem[]>([]);

  const [isOpenListPaymentSchedule, setIsOpenListPaymentSchedule] =
    useState<Boolean>(false);

  const [selectedDate, setSelectedDate] = useState<DateItem>();

  const [onSubmitMakeAnOrder, seOnSubmitMakeAnOrder] = useState(false);

  const [listSchedulePreview, setListSchedulePreview] =
    useState<PaymentSchedulePreview[]>();

  const { isAllowPayment } = usePermissions()

  useEffect(() => {
    authPreviewOrSelectDate(project, onRedirect, isAllowPayment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isAllowPayment]);

  useEffect(() => {
    let days = [];
    var today = moment().startOf("month");
    for (var i = 0; i < 6; i++) {
      days[i] = {
        id: i,
        date: today.clone().add(i + 1, "M"),
      };
    }
    setSelectedDate(days[0]);
    setListDate([...days]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedDate) {
      dispatch(setLoading(true));
      const params: GetPaymentSchedulePreview = {
        projectId: projectId,
        startDate: moment(selectedDate.date).toDate(),
      };
      PaymentScheduleService.getPaymentSchedulePreview(params)
        .then((res) => {
          setListSchedulePreview(res?.data);
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const selectedDatePayment = (dateItem: DateItem) => {
    setSelectedDate(dateItem);
  };

  const onToggleListPaymentSchedule = () => {
    setIsOpenListPaymentSchedule(!isOpenListPaymentSchedule);
  };

  const goToPayment = () => {
    dispatch(
      push(
        routes.project.detail.paymentBilling.previewAndPayment.preview.replace(
          ":id",
          `${project.id}`
        )
      )
    );
  };

  const goToMakeAnOrder = () => {
    seOnSubmitMakeAnOrder(true);
  };

  const onConfirmMakeAnOrder = () => {
    seOnSubmitMakeAnOrder(false);
  };

  const submitMakeAnOrder = () => {
    if (!selectedDate) return;
    dispatch(setLoading(true));
    PaymentScheduleService.paymentScheduleMakeAnOrder({
      projectId: projectId,
      startDate: moment(selectedDate.date).toDate(),
    })
      .then((res) => {
        seOnSubmitMakeAnOrder(false);
        dispatch(setPaymentIsMakeAnOrderSuccessReducer(true));
        dispatch(
          setProjectReducer({
            ...project,
            ...res,
          })
        );
        dispatch(getPaymentSchedulesRequest(project.id));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };

  const { formatMonth, formatYear, formatFullDate, formatMonthYear } = useDateTime()

  return (
    <PageRoot>
      <LeftContent>
        <Content classes={{root: classes.rootContent}}>
          <Grid classes={{ root: classes.root }}>
            <Grid pt={4}>
              <Heading4
                $colorName={"--eerie-black"}
                translation-key="brand_track_select_start_date_title"
              >
                {t("brand_track_select_start_date_title")}
              </Heading4>
              <ParagraphBody
                $colorName={"--eerie-black"}
                translation-key="brand_track_select_start_date_description"
              >
                {t("brand_track_select_start_date_description")}
              </ParagraphBody>
              <Grid className={classes.listDate}>
                <Grid ml={3} className={classes.contentListDate}>
                  {listDate?.map((item, index) => (
                    <Box
                      mr={2}
                      key={index}
                      className={clsx(classes.itemDate, {
                        [classes.itemDateActive]: index === selectedDate.id,
                      })}
                      onClick={() => {
                        selectedDatePayment(item);
                      }}
                    >
                      <span className={classes.iconActive}>
                        <DoneIcon />
                      </span>
                      <Heading5 className={classes.titleMonth} pb={2}>
                        {formatMonth(item.date).toUpperCase()}
                      </Heading5>
                      <ParagraphBody>
                        {formatYear(item.date)}
                      </ParagraphBody>
                    </Box>
                  ))}
                </Grid>
              </Grid>
              {selectedDate && (
                <Grid pb={4}>
                  <ParagraphBody
                    $colorName={"--eerie-black"}
                    className={classes.note}
                    translation-key="brand_track_select_start_date_note_selected_date"
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "brand_track_select_start_date_note_selected_date",
                        {
                          date: formatFullDate(listSchedulePreview?.[0]?.dueDate),
                          scheduledMonths:
                            listSchedulePreview?.[0]?.scheduledMonths,
                        }
                      ),
                    }}
                  >
                  </ParagraphBody>
                </Grid>
              )}
              {listSchedulePreview && (
                <>
                  <Grid className={classes.viewPaymentScheduleTextWrapper}>
                    <ArrowRightIcon
                      sx={{color: "var(--cimigo-blue)"}}
                      className={clsx({
                        [classes.rotateIcon]: isOpenListPaymentSchedule,
                      })}
                    />
                    <ParagraphBodyUnderline
                      $colorName={"--cimigo-blue"}
                      onClick={onToggleListPaymentSchedule}
                      translation-key="brand_track_select_start_date_view_payment_schedules"
                    >
                      {t("brand_track_select_start_date_view_payment_schedules")}
                    </ParagraphBodyUnderline>
                  </Grid>
                  {isOpenListPaymentSchedule && (
                    <Grid pt={2}>
                      <ParagraphBody
                        $colorName={"--eerie-black"}
                        translation-key="brand_track_select_start_date_title_payment_schedule"
                      >
                        {t("brand_track_select_start_date_title_payment_schedule")}
                      </ParagraphBody>
                      <Grid className={classes.listPayment} pt={2}>
                        <Grid container spacing={2}>
                          {listSchedulePreview?.map((schedulePreview) => {
                            return (
                              <Grid item xs={12} md={5} key={schedulePreview.order}>
                                <Box className={classes.payment}>
                                  <Grid className={classes.contentPayment}>
                                    <Heading3
                                      $colorName={"--gray-80"}
                                      translation-key="brand_track_select_start_date_payment"
                                      dangerouslySetInnerHTML={{
                                        __html: t(
                                          "brand_track_select_start_date_payment",
                                          {
                                            ordinal: formatOrdinalumbers(
                                              schedulePreview.order,
                                              i18n.language
                                            ),
                                          }
                                        ),
                                      }}
                                    ></Heading3>
                                    <ParagraphBody
                                      $colorName={"--gray-80"}
                                      translation-key={"common_month"}
                                    >
                                      {schedulePreview.scheduledMonths}{" "}
                                      {t("common_month", {
                                        s:
                                          schedulePreview.scheduledMonths === 1
                                            ? ""
                                            : t("common_s"),
                                      })}{" "}
                                      (
                                      {`${formatMonthYear(schedulePreview.startDate)} - ${formatMonthYear(schedulePreview.endDate)}`}
                                      )
                                    </ParagraphBody>
                                    <Heading3
                                      $colorName={"--gray-80"}
                                      $fontWeight={400}
                                      pt={1}
                                    >
                                      <span className={classes.iconDolar}>
                                        <Dolar />
                                      </span>
                                      {
                                        getCostCurrency(schedulePreview.totalAmount)
                                          ?.show
                                      }
                                    </Heading3>
                                    <ParagraphSmall
                                      $colorName={"--gray-80"}
                                      pt={2}
                                      translation-key={"brand_track_due_date"}
                                    >
                                      {`${t("brand_track_due_date")} ${formatFullDate(schedulePreview.dueDate)}`}
                                    </ParagraphSmall>
                                  </Grid>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </>
              )}

              <Grid className={classes.btnFooter} pt={4}>
                <Button
                  className={classes.btnBack}
                  btnType={BtnType.Outlined}
                  children={
                    <TextBtnSecondary
                      $colorName={"--cimigi-blue"}
                      translation-key={"common_back"}
                    >
                      {t("common_back")}
                    </TextBtnSecondary>
                  }
                  onClick={goToPayment}
                />
                <Button
                  className={classes.btnBack}
                  btnType={BtnType.Raised}
                  children={
                    <TextBtnSecondary
                      translation-key={
                        "brand_track_select_start_date_button_make_an_order"
                      }
                    >
                      {t("brand_track_select_start_date_button_make_an_order")}
                    </TextBtnSecondary>
                  }
                  onClick={goToMakeAnOrder}
                />
              </Grid>
              <Grid className={classes.disTermsOfServices} pt={1}>
                <ParagraphSmall $colorName={"--gray-60"}>
                  <span translation-key="brand_track_select_start_date_sub_tab_make_an_order_confirm_des_1">
                    {t(
                      "brand_track_select_start_date_sub_tab_make_an_order_confirm_des_1"
                    )}
                  </span>{" "}
                  <a
                    className={classes.linkTermOfService}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={routesOutside(i18n.language)?.rapidsurveyTermsOfService}
                    translation-key="brand_track_select_start_date_sub_tab_make_an_order_confirm_des_2"
                  >
                    {t(
                      "brand_track_select_start_date_sub_tab_make_an_order_confirm_des_2"
                    )}
                  </a>{" "}
                  <span translation-key="brand_track_select_start_date_sub_tab_make_an_order_confirm_des_3">
                    {t(
                      "brand_track_select_start_date_sub_tab_make_an_order_confirm_des_3"
                    )}
                  </span>
                </ParagraphSmall>
              </Grid>
            </Grid>
          </Grid>
          <PopupConfirmMakeAnOrder
            isOpen={onSubmitMakeAnOrder}
            project={project}
            paymentSchedule={listSchedulePreview?.[0]}
            onCancel={onConfirmMakeAnOrder}
            onSubmit={() => submitMakeAnOrder()}
          />
          <Footer />
        </Content>
      </LeftContent>
    </PageRoot>
  );
});
export default SelectDate;
