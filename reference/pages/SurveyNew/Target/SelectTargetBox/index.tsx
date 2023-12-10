import { Box, Grid, useTheme, useMediaQuery } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ETab, TabItem } from "../models";
import classes from "./styles.module.scss";
import images from "config/images";
import React from "react";
import clsx from "clsx";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { Project } from "models/project";
import { TargetQuestion, TargetQuestionType } from "models/Admin/target";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import { KeyboardArrowRight } from "@mui/icons-material";
import HouseholdIncomeTab from "./HouseholdIncomeTab";
import AgeCoverageTab from "./AgeCoverageTab";
import LocationTab from "./LocationTab";
import PopupLocationMobile from "../components/PopupLocationMobile";
import PopupHouseholdIncomeMobile from "../components/PopupHouseholdIncomeMobile";
import PopupAgeCoverageMobile from "../components/PopupAgeCoverageMobile";
import ProjectHelper from "helpers/project";
import _ from "lodash";
import { TargetService } from "services/target";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "routers/routes";

type ErrorsTarget = {
  [key in ETab]?: boolean;
};
interface SelectTargetBoxProp {
  project?: Project;
  clickNextQuotas?:boolean;
  setClickNextQuotas?: (val: boolean) => void;
}

const SelectTargetBox = memo(
  ({
    project,
    clickNextQuotas,
    setClickNextQuotas,
  }: SelectTargetBoxProp) => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState<ETab>();
    const [errorsTarget, setErrorsTarget] = useState<ErrorsTarget>({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(1024));
    const [questionsLocation, setQuestionsLocation] = useState<TargetQuestion[]>([])
    const [questionsHouseholdIncome, setQuestionsHouseholdIncome] = useState<TargetQuestion[]>([])
    const [questionsAgeGender, setQuestionsAgeGender] = useState<TargetQuestion[]>([])
    const [questionsMum, setQuestionsMum] = useState<TargetQuestion[]>([])
    const dispatch = useDispatch();

    const listTabs: TabItem[] = useMemo(() => {
      return [
        {
          id: ETab.Location,
          title: t("target_sub_tab_location"),
          img: images.imgTargetTabLocation,
        },
        {
          id: ETab.Household_Income,
          title: t("target_sub_tab_household_income"),
          img: images.imgTargetTabHI,
        },
        {
          id: ETab.Age_Coverage,
          title: t("target_sub_tab_age_coverage"),
          img: images.imgTargetTabAC,
        },
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);
    const onChangeTab = (tab?: ETab) => {
      if (activeTab === tab) return;
      setActiveTab(tab);
    };
    const renderHeaderTab = (tab: TabItem) => {
      switch (tab.id) {
        case ETab.Location:
          const targetLs = project?.targets?.filter(
            (it) => it.targetQuestion?.typeId === TargetQuestionType.Location
          );
          if (targetLs?.length) {
            return (
              <Grid className={classes.tabBodySelected}>
                {targetLs.map((it) => (
                  <ParagraphSmall
                    $colorName="--eerie-black"
                    key={it.id}
                    sx={{ "& >span": { fontWeight: 500 } }}
                  >
                    <span>{it.targetQuestion?.name}: </span>
                    {it.answers.map((it) => it.name).join(", ")}.
                  </ParagraphSmall>
                ))}
              </Grid>
            );
          } else
            return (
              <Grid className={classes.tabBodyDefault}>
                <ParagraphSmallUnderline2 translation-key="target_sub_tab_location_sub">
                  {t("target_sub_tab_location_sub")}
                </ParagraphSmallUnderline2>
              </Grid>
            );
        case ETab.Household_Income:
          const targetECs = project?.targets?.filter(
            (it) =>
              it.targetQuestion?.typeId === TargetQuestionType.Household_Income
          );
          if (targetECs?.length) {
            return (
              <Grid className={classes.tabBodySelected}>
                {targetECs.map((it) => (
                  <ParagraphSmall
                    $colorName="--eerie-black"
                    key={it.id}
                    sx={{ "& >span": { fontWeight: 500 } }}
                  >
                    <span>{it.targetQuestion?.name}: </span>
                    {it.answers.map((it) => it.name).join(", ")}.
                  </ParagraphSmall>
                ))}
              </Grid>
            );
          } else
            return (
              <Grid className={classes.tabBodyDefault}>
                <ParagraphSmallUnderline2 translation-key="target_choose_household_income">
                  {t("target_choose_household_income")}
                </ParagraphSmallUnderline2>
              </Grid>
            );
        case ETab.Age_Coverage:
          const targetACs = project?.targets?.filter((it) =>
            [
              TargetQuestionType.Mums_Only,
              TargetQuestionType.Gender_And_Age_Quotas,
            ].includes(it.targetQuestion?.typeId || 0)
          );
          if (targetACs?.length) {
            return (
              <Grid className={classes.tabBodySelected}>
                {targetACs.map((it) => (
                  <ParagraphSmall
                    $colorName="--eerie-black"
                    key={it.id}
                    sx={{ "& >span": { fontWeight: 500 } }}
                  >
                    <span>{it.targetQuestion?.name}: </span>
                    {it.answers.map((it) => it.name).join(", ")}.
                  </ParagraphSmall>
                ))}
              </Grid>
            );
          } else
            return (
              <Grid className={classes.tabBodyDefault}>
                <ParagraphSmallUnderline2 translation-key="target_sub_tab_age_coverage_sub">
                  {t("target_sub_tab_age_coverage_sub")}
                </ParagraphSmallUnderline2>
              </Grid>
            );
      }
    };
    const triggerErrors = () => {
      const _errorsTarget: ErrorsTarget = {};
      if (!ProjectHelper.isValidTargetTabLocation(project)) {
        _errorsTarget[ETab.Location] = true;
      }
      if (!ProjectHelper.isValidTargetTabHI(project)) {
        _errorsTarget[ETab.Household_Income] = true;
      }
      if (!ProjectHelper.isValidTargetTabAC(project)) {
        _errorsTarget[ETab.Age_Coverage] = true;
      }
      return _errorsTarget;
    };
    useEffect(() => {
      if (project && !_.isEmpty(errorsTarget)) {
        setErrorsTarget(triggerErrors());
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project]);
    useEffect(() => {
      if (clickNextQuotas) {
        setClickNextQuotas(!clickNextQuotas);
        const _errorsTarget = triggerErrors();
        setErrorsTarget(_errorsTarget);
        if (
          _errorsTarget[ETab.Location] ||
          _errorsTarget[ETab.Household_Income] ||
          _errorsTarget[ETab.Age_Coverage]
        ) {
          return;
        }else{
          dispatch(
            push(routes.project.detail.quotas.replace(":id", `${project.id}`))
          );
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickNextQuotas]);
    useEffect(() => {
      const fetchData = async () => {
        const questions: TargetQuestion[] = await TargetService.getQuestions({
          take: 9999,
        })
          .then((res) => res.data)
          .catch(() => Promise.resolve([]));
        const _questionsLocation = questions.filter(
          (it) => it.typeId === TargetQuestionType.Location
        );
        const _questionsHouseholdIncome = questions.filter(
          (it) => it.typeId === TargetQuestionType.Household_Income
        );
        const _questionsAgeGender = questions.filter(
          (it) => it.typeId === TargetQuestionType.Gender_And_Age_Quotas
        );
        const _questionsMum = questions.filter(
          (it) => it.typeId === TargetQuestionType.Mums_Only
        );
        setQuestionsLocation(_questionsLocation);
        setQuestionsHouseholdIncome(_questionsHouseholdIncome);
        setQuestionsAgeGender(_questionsAgeGender);
        setQuestionsMum(_questionsMum);
      };
      fetchData();
    }, []);
    return (
      <Grid className={classes.targetBox}>
        <Box className={classes.targetTabs}>
          {listTabs.map((item, index) => (
            <React.Fragment key={index}>
              <Box
                onClick={() =>
                  onChangeTab(activeTab === item.id ? undefined : item.id)
                }
                className={clsx(classes.targetTab, {
                  [classes.targetTabActive]: activeTab === item.id && !isMobile,
                  [classes.tabError]: errorsTarget[item.id],
                })}
              >
                <Box className={classes.tabHeader}>
                  <Box className={classes.tabBoxTitle}>
                    <ParagraphExtraSmall $colorName="--gray-90">
                      {item.title}
                    </ParagraphExtraSmall>
                  </Box>
                  <img
                    className={classes.tabImg}
                    src={item.img}
                    alt="tab target"
                  />
                </Box>
                <Box className={classes.tabBody}>{renderHeaderTab(item)}</Box>
              </Box>
              {listTabs.length - 1 !== index && (
                <Box className={classes.tabIconBox}>
                  <KeyboardArrowRight />
                </Box>
              )}
            </React.Fragment>
          ))}
        </Box>
        {activeTab && !isMobile && (
          <Box
            className={clsx(classes.tabPanel, {
              [classes.error]: errorsTarget[activeTab],
            })}
          >
            {activeTab === ETab.Location && (
              <LocationTab
                project={project}
                questions={questionsLocation}
                onNextStep={() => onChangeTab(ETab.Household_Income)}
              />
            )}
            {activeTab === ETab.Household_Income && (
              <HouseholdIncomeTab
                project={project}
                questions={questionsHouseholdIncome}
                onNextStep={() => onChangeTab(ETab.Age_Coverage)}
              />
            )}
            {activeTab === ETab.Age_Coverage && (
              <AgeCoverageTab
                project={project}
                questionsAgeGender={questionsAgeGender}
                questionsMum={questionsMum}
                onNextStep={() => onChangeTab()}
              />
            )}
          </Box>
        )}
        {isMobile && (
          <>
            <PopupLocationMobile
              isOpen={activeTab === ETab.Location}
              project={project}
              questions={questionsLocation}
              onCancel={() => onChangeTab()}
            />
            <PopupHouseholdIncomeMobile
              isOpen={activeTab === ETab.Household_Income}
              project={project}
              questions={questionsHouseholdIncome}
              onCancel={() => onChangeTab()}
            />
            <PopupAgeCoverageMobile
              isOpen={activeTab === ETab.Age_Coverage}
              project={project}
              questionsAgeGender={questionsAgeGender}
              questionsMum={questionsMum}
              onCancel={() => onChangeTab()}
            />
          </>
        )}
      </Grid>
    );
  }
);
export default SelectTargetBox;

