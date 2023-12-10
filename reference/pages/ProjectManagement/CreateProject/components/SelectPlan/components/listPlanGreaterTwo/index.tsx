import Grid from "@mui/material/Grid";
import { memo, useMemo } from "react";
import classes from "./styles.module.scss";
import { Plan } from "models/Admin/plan";
import Heading1 from "components/common/text/Heading1";
import { DataPagination } from "models/general";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Heading3 from "components/common/text/Heading3";
import DoneIcon from "@mui/icons-material/Done";
import CardActions from "@mui/material/CardActions";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { ESOLUTION_TYPE } from "models/solution";
import { Solution } from "models/Admin/solution";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
interface SelectPlanProps {
  plan?: DataPagination<Plan>;
  onChangePlanSelected?: (plan: Plan) => void;
  formatMoney?: (plan: Plan) => any;
  solutionSelected: Solution
}
// style plan have >= 3 options
const listPlanGreaterTwo = memo(({ formatMoney, onChangePlanSelected, plan, solutionSelected }: SelectPlanProps) => {
  const { t } = useTranslation();
  const isRenderInterviewNumbers = useMemo(() => ![ESOLUTION_TYPE.BRAND_TRACKING].includes(solutionSelected?.typeId), [solutionSelected])

  return (
    <Grid
      container
      className={classes.body}
      justifyContent="center"
      columnSpacing={{xs: 0, sm:4}}
      rowSpacing={{xs: 4, sm: 5}}
    >
      {plan?.data.map((planItem) => {
        return (
          <Grid
            key={planItem.id}
            className={clsx(classes.card, {
              [classes.cardPopular]: planItem?.isMostPopular,
            })}
            item
            xs={12}
            sm={6}
            lg={4}
          >
            <Grid
              item
              className={clsx(classes.layoutCard, {
                [classes.layoutCardPopular]: planItem?.isMostPopular,
              })}
            >
              {planItem?.isMostPopular && (
                <div className={classes.headerCart}>
                  <ParagraphBody className={classes.title} $colorName={"--cimigo-green-dark-3"} translation-key="common_most_pupular">
                    {t("common_most_pupular")}
                  </ParagraphBody>
                </div>
              )}
              <Card className={classes.cardPlan}>
                <CardContent className={classes.cardCustom}>
                  <Grid container px={{ sm: 2, xs: 1 }}>
                    <Grid xs={12} item>
                      <Typography mb={2}>
                        <Heading3 $fontWeight={"500"} $colorName={"--eerie-black-00"} variant="body2" variantMapping={{ body2: "span" }}>
                          {planItem.title}
                        </Heading3>
                      </Typography>
                      <Typography display={"flex"} alignItems={"center"}>
                        <Heading1
                          $fontSize={"28px"}
                          $fontWeight={"600"}
                          $colorName={"--cimigo-blue"}
                          variant="body2"
                          variantMapping={{ body2: "span" }}
                        >
                          {formatMoney(planItem)}
                        </Heading1>
                        {planItem.month && (
                          <ParagraphBody
                            className={classes.expTime}
                            $colorName={"--gray-80"}
                            translation-key="common_month"
                            variant="body2"
                            variantMapping={{ body2: "span" }}
                          >
                            / {planItem.month > 1 ? planItem.month : ""}{" "}
                            {t("common_month", {
                              s: planItem.month === 1 ? "" : t("common_s"),
                            })}
                          </ParagraphBody>
                        )}
                      </Typography>
                      <Typography className={classes.tax} color={"--gray-60"}>
                        <ParagraphExtraSmall
                          $colorName={"--gray-60"}
                          translation-key="common_tax_exclusive"
                          variant="body2"
                          variantMapping={{ body2: "span" }}
                        >
                          {t("common_tax_exclusive")}
                        </ParagraphExtraSmall>
                      </Typography>
                    </Grid>
                  </Grid>
                  <CardActions className={classes.itemCenter}>
                    <Button
                      fullWidth
                      sx={{ mx: 2}}
                      btnType={BtnType.Raised}
                      translation-key="setup_survey_popup_save_question_title"
                      children={<TextBtnSecondary translation-key="common_select">{t("common_select")}</TextBtnSecondary>}
                      className={classes.btnSave}
                      onClick={() => onChangePlanSelected(planItem)}
                    />
                  </CardActions>
                  <Typography variant="body2" variantMapping={{ body2: "div" }}>
                    <div className={classes.line}></div>
                  </Typography>
                  <Grid className={classes.contentInPlan} container px={2}>
                    {
                      isRenderInterviewNumbers && (
                        <Grid className={classes.contentPlan} xs={12} item>
                          <DoneIcon className={classes.iconContentPlan} />
                          <ParagraphBody
                            ml={1.5}
                            $colorName={"--eerie-black-00"}
                            variant="body2"
                            variantMapping={{ body2: "span" }}
                            translation-key="project_create_tab_plan_interviews"
                          >
                            <span className={classes.sampleSize}>{planItem.sampleSize}</span> {t("project_create_tab_plan_interviews")}{" "}
                            {planItem.month && (
                              <ParagraphBody
                                className={classes.expTime}
                                $colorName={"--gray-80"}
                                translation-key={"common_month"}
                                variant="body2"
                                variantMapping={{ body2: "span" }}
                              >
                                / {t("common_month", { s: "" })}
                              </ParagraphBody>
                            )}
                          </ParagraphBody>
                        </Grid>
                      )
                    }
                    {planItem?.content.map((item, index) => {
                      return (
                        <Grid className={classes.contentPlan} key={index} xs={12} item>
                          <DoneIcon className={classes.iconContentPlan} />
                          <ParagraphBody ml={1.5} $colorName={"--eerie-black-00"} className={classes.contentPlanDescription}>
                            {item}
                          </ParagraphBody>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
});
export default listPlanGreaterTwo;
