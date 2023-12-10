import { useEffect, useMemo, useRef, useState } from "react";
import classes from "./styles.module.scss";
import { Grid, Step, Stepper, StepLabel, StepConnector, useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Helmet } from "react-helmet";
import QontoStepIcon from "../components/QontoStepIcon";
import { SolutionService } from "services/solution";
import { Solution } from "models/Admin/solution";
import { routes } from "routers/routes";
import { ReducerType } from "redux/reducers";
import SelectPlan from "./components/SelectPlan";
import { Plan } from "models/Admin/plan";
import CreateProjectStep from "./components/CreateProjectStep";
import SolutionList from "./components/SolutionList";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { setCreateProjectRedirectReducer } from "redux/reducers/Project/actionTypes";
import SubTitle from "components/common/text/SubTitle";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { PlanService } from "services/plan";
import BasicLayout from "layout/BasicLayout";
import { DataPagination } from "models/general";
import { UserGetPlans } from "models/plan";
import { usePrice } from "helpers/price";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";
import QueryString from "query-string";
import { replace } from "connected-react-router";
import useDebounce from "hooks/useDebounce";

interface IQueryString {
  solutionId?: string;
  planId?: string;
}

export enum EStep {
  SELECT_SOLUTION,
  SELECT_PLAN,
  CREATE_PROJECT,
}

const CreateProject = () => {
  const { t, i18n } = useTranslation();

  const waitting = useRef<{ redux: boolean; query: boolean }>({ redux: true, query: true });
  const { createProjectRedirect } = useSelector((state: ReducerType) => state.project);

  const query: IQueryString = QueryString.parse(window.location.search);
  const solutionId = useMemo(() => (query.solutionId ? Number(query.solutionId) : undefined), [query.solutionId]);
  const planId = useMemo(() => (query.planId ? Number(query.planId) : undefined), [query.planId]);

  const { getCostCurrency } = usePrice();

  const dispatch = useDispatch();
  const history = useHistory();
  const [loadingData, setLoadingData] = useState(true);
  const [solutionShow, setSolutionShow] = useState<Solution>();
  const [solutionSelected, setSolutionSelected] = useState<Solution>();
  const [activeStep, setActiveStep] = useState<EStep>(EStep.SELECT_SOLUTION);
  const [planSelected, setPlanSelected] = useState<Plan>();
  const [plan, setPlan] = useState<DataPagination<Plan>>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(767));

  const replaceQuery = (object: { solutionId?: number; planId?: number }) => {
    let query = QueryString.stringify(object);
    dispatch(replace({ search: query }));
  };

  const waitingCompleted = (key: "redux" | "query") => {
    waitting.current[key] = false;
    if (!waitting.current.redux && !waitting.current.query) setLoadingData(false);
  };

  const fetchQuery = async (data: { solutionId?: number; planId?: number }, key: "redux" | "query") => {
    const _solutionId = data.solutionId;
    const _planId = data.planId;
    if (!_planId && !_solutionId) {
      waitingCompleted(key);
      return;
    }
    if (_planId && !_solutionId) replaceQuery({});
    dispatch(setLoading(true));
    const solution: Solution = await SolutionService.getSolution(_solutionId).catch(() => null);
    if (solution) {
      let _solutionSelected = solution;
      let _planSelected: Plan;
      let _activeStep = EStep.SELECT_PLAN;
      if (_planId) {
        const plan: Plan = await PlanService.getPlan(_planId).catch(() => null);
        if (plan?.solutionId !== solution.id) replaceQuery({ solutionId: _solutionId });
        else {
          _planSelected = plan;
          _activeStep = EStep.CREATE_PROJECT;
        }
      }
      setSolutionSelected(_solutionSelected);
      setPlanSelected(_planSelected);
      setActiveStep(_activeStep);
    } else replaceQuery({});
    dispatch(setLoading(false));
    waitingCompleted(key);
  };

  useEffect(() => {
    fetchQuery({ solutionId, planId }, "query");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQuery = useDebounce(() => {
    if (waitting.current.query || waitting.current.redux) return;
    if (solutionId !== solutionSelected?.id || planId !== planSelected?.id) {
      replaceQuery({ solutionId: solutionSelected?.id, planId: planSelected?.id });
    }
  }, 500);

  useEffect(() => {
    updateQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutionSelected, planSelected]);

  const handleNextStep = () => {
    if (!solutionShow) return;
    setSolutionSelected(solutionShow);
    setSolutionShow(undefined);
    setActiveStep(EStep.SELECT_PLAN);
  };

  const onClickHandleBack = (step: EStep) => {
    switch (step) {
      case EStep.SELECT_PLAN: {
        setPlanSelected(null);
        setActiveStep(EStep.SELECT_PLAN);
        break;
      }
      default: {
        setPlanSelected(null);
        setSolutionSelected(null);
        setActiveStep(EStep.SELECT_SOLUTION);
      }
    }
  };
  const onChangePlanSelected = (plan: Plan) => {
    setPlanSelected(plan);
    setActiveStep(EStep.CREATE_PROJECT);
  };
  const onChangeSolution = (solution: Solution) => {
    setSolutionShow(solution);
  };
  const stepLabel = (id: number) => {
    switch (id) {
      case EStep.SELECT_SOLUTION: {
        return solutionSelected?.title;
      }
      case EStep.SELECT_PLAN: {
        return (
          planSelected && (
            <>
              {`${planSelected?.title}: `}
              <span className="nowrap">{getCostCurrency(planSelected?.price)?.show}</span>
            </>
          )
        );
      }
    }
    return null;
  };

  useEffect(() => {
    if (solutionSelected?.id) {
      const getListPlan = () => {
        dispatch(setLoading(true));
        const params: UserGetPlans = {
          take: 99999,
          solutionId: solutionSelected?.id || undefined,
        };
        PlanService.getPlans(params)
          .then((res) => {
            setPlan({
              data: res.data,
              meta: res.meta,
            });
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)));
      };
      getListPlan();
    }
  }, [dispatch, solutionSelected]);

  const steps = useMemo(() => {
    return [
      { id: EStep.SELECT_SOLUTION, name: t(`project_create_tab_solution_select_solution_title`) },
      { id: EStep.SELECT_PLAN, name: t(`project_create_tab_plan_select_plan_title`) },
      { id: EStep.CREATE_PROJECT, name: t(`project_create_tab_create_project_title`) },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  useEffect(() => {
    if (createProjectRedirect?.planId || createProjectRedirect?.solutionId) {
      const data = { solutionId: createProjectRedirect.solutionId, planId: createProjectRedirect.planId };
      dispatch(setCreateProjectRedirectReducer(null));
      replaceQuery(data);
      fetchQuery(data, "redux");
    } else waitingCompleted("redux");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createProjectRedirect]);

  useEffect(() => {
    document.getElementById("basic-content")?.scrollTo(0, 0);
  }, [activeStep]);

  return (
    <BasicLayout className={classes.root} HeaderProps={{ project: true }}>
      <Helmet>
        <title>RapidSurvey - Create new project</title>
      </Helmet>
      <Grid className={classes.container}>
        <div className={classes.linkTextHome}>
          <TopicOutlinedIcon className={classes.icHome} onClick={() => history.push(routes.project.management)}></TopicOutlinedIcon>
          <ArrowForwardIosIcon className={classes.icHome}></ArrowForwardIosIcon>
          <SubTitle $colorName={"--cimigo-green-dark-2"} translation-key="header_projects">
            {t("header_projects")}
          </SubTitle>
        </div>
        {!loadingData && (
          <>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              classes={{ root: classes.rootStepper }}
              connector={
                <StepConnector
                  classes={{
                    root: classes.rootConnector,
                    active: classes.activeConnector,
                  }}
                />
              }
            >
              {steps.map((item, index) => {
                return (
                  <Step key={index}>
                    <StepLabel
                      StepIconComponent={QontoStepIcon}
                      classes={{
                        root: classes.rootStepLabel,
                        completed: classes.rootStepLabelCompleted,
                        active: classes.rootStepLabelActive,
                        label: classes.rootStepLabel,
                      }}
                    >
                      {item.name} {!isMobile && <ParagraphExtraSmall $colorName={"--gray-60"}>{stepLabel(item.id)}</ParagraphExtraSmall>}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === EStep.SELECT_SOLUTION && <SolutionList solutionShow={solutionShow} onChangeSolution={onChangeSolution} handleNextStep={handleNextStep} />}
            {activeStep === EStep.SELECT_PLAN && <SelectPlan plan={plan} onChangePlanSelected={onChangePlanSelected} solutionSelected={solutionSelected} />}
            {activeStep === EStep.CREATE_PROJECT && <CreateProjectStep solutionSelected={solutionSelected} planSelected={planSelected} plan={plan} onClickHandleBack={onClickHandleBack} />}
          </>
        )}
      </Grid>
    </BasicLayout>
  );
};
export default CreateProject;
