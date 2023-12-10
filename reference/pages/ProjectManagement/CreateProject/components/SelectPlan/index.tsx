import Grid from "@mui/material/Grid";
import { memo, useCallback, useMemo} from "react";
import classes from "./styles.module.scss";
import { Plan } from "models/Admin/plan";
import Heading1 from "components/common/text/Heading1";
import { DataPagination, ECurrency, currencySymbol } from "models/general";
import ParagraphBody from "components/common/text/ParagraphBody";
import { useTranslation } from "react-i18next";
import useAuth from "hooks/useAuth";
import ListPlanGreaterTwo from './components/listPlanGreaterTwo';
import ListPlanTwoOrLess from './components/listPlanTwoOrLess';
import { Solution } from "models/Admin/solution";
import ProjectHelper from "helpers/project";

interface SelectPlanProps {
  plan?: DataPagination<Plan>;
  onChangePlanSelected?: (plan: Plan) => void;
  solutionSelected?: Solution
}
const SelectPlan = memo(({onChangePlanSelected, plan, solutionSelected }: SelectPlanProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const formatMoney = useCallback(
    (plan: Plan) => {
      switch (user?.currency) {
        case ECurrency.VND:
          return `${currencySymbol[ECurrency.VND].first}${plan.priceVND}${currencySymbol[ECurrency.VND].last}`;
        case ECurrency.USD:
          return `${currencySymbol[ECurrency.USD].first}${plan.priceUSD}${currencySymbol[ECurrency.USD].last}`;
      }
    },
    [user?.currency]
  );
  const handleChangeSelected = (plan: Plan) => {
    onChangePlanSelected(plan);
  };

  return (
    <>
      <Grid justifyContent="center" className={classes.titleSelectPlan}>
        <Heading1
          mb={3}
          className={classes.title}
          $colorName={"--cimigo-blue"}
          translation-key={`project_create_tab_plan_title`}
        >
          {t(`project_create_tab_plan_title`)}
        </Heading1>
        <Grid className={classes.titleSelectPlan}>
          <ParagraphBody
            mb={4}
            $colorName={"--eerie-black"}
            translation-key="project_create_tab_plan_description_plan"
            dangerouslySetInnerHTML={{
              __html: t("project_create_tab_plan_description_plan"),
            }}
          ></ParagraphBody>
        </Grid>
      </Grid>
        {
          plan?.data?.length > 2
            ? <ListPlanGreaterTwo
                solutionSelected={solutionSelected}
                plan={plan}
                onChangePlanSelected={handleChangeSelected}
                formatMoney={formatMoney}
              />
            : <ListPlanTwoOrLess
                solutionSelected={solutionSelected}
                plan={plan}
                onChangePlanSelected={handleChangeSelected}
                formatMoney={formatMoney}
              />
        }
    </>
  );
});
export default SelectPlan;
