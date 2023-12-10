import { useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import {
  Box,
  Grid,
  Tab,
  Tabs,
  MenuItem,
  IconButton,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  matchPath,
  Redirect,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import {
  getProjectRequest,
  refreshTriggerValidate,
  setProjectReducer,
} from "redux/reducers/Project/actionTypes";
import Header from "components/Header";
import { routes } from "routers/routes";
import { push } from "connected-react-router";
import { Check, CheckCircle, KeyboardArrowRight } from "@mui/icons-material";
import Heading4 from "components/common/text/Heading4";
import BodySmall from "components/common/text/BodySmall";
import ChipProjectStatus from "components/common/status/ChipProjectStatus";
import { ProjectService } from "services/project";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import Button, { BtnType } from "components/common/buttons/Button";
import SubTitle from "components/common/text/SubTitle";
import InputTextfield from "components/common/inputs/InputTextfield";
import SetupSurvey from "./SetupSurvey";
import VideoChoice from "./VideoChoice";
import Quotas from "./Quotas";
import Pay from "./Pay";
import BrandTrackPay from "./BrandTrack/PayNew";
import ProjectHelper from "helpers/project";
import Report from "./Report";
import BrandTrackReport from "./BrandTrack/Report";
import { ETabRightPanel } from "models/project";
import { useChangePrice } from "hooks/useChangePrice";
import { Helmet } from "react-helmet";
import { ESOLUTION_TYPE } from "models";
import BrandTrack from "./BrandTrack";
import BrandTrackTarget from "./BrandTrack/Target";
import Target from "./Target";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";
import IconPeopleAltOutline from "components/icons/IconPeopleAltOutline";
import PopupShareProject from "./components/PopupShareProject";
import usePermissions from "hooks/usePermissions";
import UseAuth from "hooks/useAuth";
import React from "react";
import PriceTest from "./PriceTest";

export const Survey = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const { project } = useSelector((state: ReducerType) => state.project);
  const [isEditName, setIsEditName] = useState(false);
  const [projectName, setProjectName] = useState<string>("");
  const [openMenuShare, setOpenMenuShare] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    isHaveChangePrice,
    setIsHaveChangePrice,
    tabRightPanel,
    setTabRightPanel,
    toggleOutlineMobile,
    onToggleViewOutlineMobile,
  } = useChangePrice();
  const { isGuest } = UseAuth();

  const tabs: string[] = useMemo(() => {
    return [
      routes.project.detail.setupSurvey,
      routes.project.detail.target,
      routes.project.detail.quotas,
      routes.project.detail.paymentBilling.root,
      routes.project.detail.report,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, routes]);

  const isValidSetup = useMemo(() => {
    return ProjectHelper.isValidSetup(project);
  }, [project]);

  const isValidTargetTab = useMemo(() => {
    return ProjectHelper.isValidTargetTab(project);
  }, [project]);

  const isPaymentPaid = useMemo(
    () => ProjectHelper.isPaymentPaid(project),
    [project]
  );

  const isReportReady = useMemo(
    () => ProjectHelper.isReportReady(project),
    [project]
  );

  const [isOpenModalShare, setIsOpenModalShare] = useState<boolean>(false);

  const { isAllowWatchEditableTabs } = usePermissions();

  const handleToggle = () => {
    setOpenMenuShare((prevOpen) => !prevOpen);
  };

  const handleCloseMenuShare = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenMenuShare(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenMenuShare(false);
    } else if (event.key === 'Escape') {
      setOpenMenuShare(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(openMenuShare);
  React.useEffect(() => {
    if (prevOpen.current === true && openMenuShare === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = openMenuShare;
  }, [openMenuShare]);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      dispatch(getProjectRequest(Number(id), undefined, true));
      dispatch(refreshTriggerValidate())
      return () => {
        dispatch(setProjectReducer(null));
      };
    }
  }, [dispatch, id]);

  const acitveTab = useMemo(() => {
    const activeRoute = (routeName: string, exact: boolean = false) => {
      const match = matchPath(window.location.pathname, {
        path: routeName,
        exact: exact,
      });
      return !!match;
    };
    const index = tabs.findIndex((it) => activeRoute(it));
    if (index === -1) return 0;
    return index;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname, tabs, isAllowWatchEditableTabs]);

  const onChangeTab = (_: any, newTab: number) => {
    dispatch(push(tabs[newTab].replace(":id", id)));
  };

  const handleEditProjectName = () => {
    setIsEditName(true);
    setProjectName(project.name);
  };

  const isValidProjectName = () => {
    return projectName && project && projectName !== project.name;
  };

  const onCloseChangeProjectName = () => {
    setProjectName("");
    setIsEditName(false);
  };

  const onChangeProjectName = () => {
    if (!isValidProjectName()) {
      onCloseChangeProjectName();
      return;
    }
    dispatch(setLoading(true));
    ProjectService.renameProject(Number(id), {
      name: projectName,
    })
      .then(() => {
        onCloseChangeProjectName();
        dispatch(
          setProjectReducer({
            ...project,
            name: projectName,
          })
        );
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(true)));
  };

  const onChangeTabRightPanel = (tab: number) => {
    if (tab === ETabRightPanel.COST_SUMMARY) setIsHaveChangePrice(false);
    setTabRightPanel(tab);
  };

  const tabActiveTitle = (tabActive) => {
    switch (tabActive) {
      case 0:
        return t("setup_tab");
      case 1:
        return t("target_tab");
      case 2:
        return t("quotas_tab");
      case 3:
        return t("payment_tab");
      case 4:
        return t("results_tab");
    }
  };

  const onShowModalShare = () => {
    setIsOpenModalShare(true);
  };

  const onCloseShowModalShareProject = () => {
    setIsOpenModalShare(false);
  };

  return (
    <Grid className={classes.root}>
      <Helmet>
        <title>{`RapidSurvey - ${project?.name} - ${tabActiveTitle(
          acitveTab
        )}`}</title>
      </Helmet>
      <Header project detail={project} />
      <Grid className={classes.subHeaderMobile}>
        <TopicOutlinedIcon
          className={classes.homeIcon}
          onClick={() => dispatch(push(routes.project.management))}
        />
        <KeyboardArrowRight
          sx={{
            fontSize: 16,
            marginLeft: "8px",
            marginRight: "8px",
            color: "var(--eerie-black-40)",
          }}
        />
        {!isEditName ? (
          <Box display={"flex"} justifyContent="space-between" width={"100%"}>
            <div className={classes.titleProjectName}>
              <SubTitle
                className={classes.projectName}
                $colorName="--cimigo-green-dark-2"
                onClick={handleEditProjectName}
              >
                {project?.name}
              </SubTitle>
            </div>
            {!isGuest && isMobile &&
              <IconButton
                className={classes.iconMore}
                onClick={handleToggle}
                ref={anchorRef}
              >
                <MoreHorizIcon />
              </IconButton>
            }
          </Box>
          
        ) : (
          <div className={classes.editBox}>
            <InputTextfield
              name=""
              size="small"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={t("field_project_name_placeholder")}
              translation-key-placeholder="field_project_name_placeholder"
            />
            <Button
              nowrap
              btnType={BtnType.Primary}
              translation-key="common_save"
              children={t("common_save")}
              padding="3px 13px"
              startIcon={<Check sx={{ fontSize: "16px !important" }} />}
              onClick={onChangeProjectName}
            />
          </div>
        )}
      </Grid>
      <Box className={classes.tabsBox}>
        <Tabs
          value={acitveTab}
          onChange={onChangeTab}
          variant="scrollable"
          classes={{
            root: classes.rootTabs,
            indicator: classes.indicatorTabs,
            flexContainer: classes.flexContainer,
          }}
        >
          {isAllowWatchEditableTabs && (
            <Tab
              value={0}
              label={
                <Box display="flex" alignItems="center">
                  {isValidSetup && (
                    <CheckCircle className={classes.tabItemIcon} />
                  )}
                  <Heading4
                    className={classes.tabItemTitle}
                    translation-key="setup_tab"
                  >
                    {t("setup_tab")}
                  </Heading4>
                </Box>
              }
            />
          )}
          {isAllowWatchEditableTabs && (
            <Tab
              value={1}
              label={
                <Box display="flex" alignItems="center">
                  {isValidTargetTab && (
                    <CheckCircle className={classes.tabItemIcon} />
                  )}
                  <Heading4
                    className={classes.tabItemTitle}
                    translation-key="target_tab"
                  >
                    {t("target_tab")}
                  </Heading4>
                </Box>
              }
            />
          )}
          {isAllowWatchEditableTabs && (
            <Tab
              value={2}
              label={
                <Box display="flex" alignItems="center">
                  {project?.agreeQuota && (
                    <CheckCircle className={classes.tabItemIcon} />
                  )}
                  <Heading4
                    className={classes.tabItemTitle}
                    translation-key="quotas_tab"
                  >
                    {t("quotas_tab")}
                  </Heading4>
                </Box>
              }
            />
          )}
          {isAllowWatchEditableTabs && (
            <Tab
              value={3}
              label={
                <Box display="flex" alignItems="center">
                  {isPaymentPaid && (
                    <CheckCircle className={classes.tabItemIcon} />
                  )}
                  <Heading4
                    className={classes.tabItemTitle}
                    translation-key="payment_tab"
                  >
                    {t("payment_tab")}
                  </Heading4>
                </Box>
              }
            />
          )}
          <Tab
            value={4}
            label={
              <Box display="flex" alignItems="center">
                {isReportReady && (
                  <CheckCircle className={classes.tabItemIcon} />
                )}
                <Heading4
                  className={classes.tabItemTitle}
                  translation-key="results_tab"
                >
                  {t("results_tab")}
                </Heading4>
              </Box>
            }
          />
        </Tabs>
        <Box className={classes.statusBox}>
          <ChipProjectStatus
            status={project?.status}
            solutionTypeId={project?.solution?.typeId}
          />
          {!isGuest && !isMobile &&
            <IconButton
              className={classes.iconMore}
              onClick={handleToggle}
              ref={anchorRef}
            >
              <MoreHorizIcon />
            </IconButton>
          }
          
        </Box>
      </Box>
      <Popper
        open={openMenuShare}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        className={classes.customMenuShare}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseMenuShare}>
                <MenuList
                  autoFocusItem={openMenuShare}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={onShowModalShare}>
                    <Box display="flex" alignItems={"center"}>
                      <IconPeopleAltOutline sx={{ marginRight: "13.5px" }} />
                      <BodySmall
                        $fontWeight="400"
                        $colorName="--gray-80"
                        translation-key="project_header_menu_share_option"
                      >
                        {t("project_header_menu_share_option")}
                      </BodySmall>
                    </Box>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <Box className={classes.tabContent}>
        <Switch>
          <Route
            exact
            path={routes.project.detail.setupSurvey}
            render={(props) => {
              if (isAllowWatchEditableTabs === null) return null;
              if (isAllowWatchEditableTabs) {
                switch (project?.solution?.typeId) {
                  case ESOLUTION_TYPE.VIDEO_CHOICE:
                    return (
                      <VideoChoice
                        {...props}
                        projectId={Number(id)}
                        isHaveChangePrice={isHaveChangePrice}
                        tabRightPanel={tabRightPanel}
                        toggleOutlineMobile={toggleOutlineMobile}
                        onToggleViewOutlineMobile={onToggleViewOutlineMobile}
                        onChangeTabRightPanel={onChangeTabRightPanel}
                      />
                    );
                  case ESOLUTION_TYPE.PACK:
                    return (
                      <SetupSurvey
                        {...props}
                        projectId={Number(id)}
                        isHaveChangePrice={isHaveChangePrice}
                        tabRightPanel={tabRightPanel}
                        toggleOutlineMobile={toggleOutlineMobile}
                        onToggleViewOutlineMobile={onToggleViewOutlineMobile}
                        onChangeTabRightPanel={onChangeTabRightPanel}
                      />
                    );
                  case ESOLUTION_TYPE.BRAND_TRACKING:
                    return (
                      <BrandTrack
                        {...props}
                        projectId={Number(id)}
                        isHaveChangePrice={isHaveChangePrice}
                        tabRightPanel={tabRightPanel}
                        toggleOutlineMobile={toggleOutlineMobile}
                        onToggleViewOutlineMobile={onToggleViewOutlineMobile}
                        onChangeTabRightPanel={onChangeTabRightPanel}
                      />
                    );
                  case ESOLUTION_TYPE.PRICE_TEST:
                    return (
                      <PriceTest
                        {...props}
                        projectId={Number(id)}
                        isHaveChangePrice={isHaveChangePrice}
                        tabRightPanel={tabRightPanel}
                        toggleOutlineMobile={toggleOutlineMobile}
                        onToggleViewOutlineMobile={onToggleViewOutlineMobile}
                        onChangeTabRightPanel={onChangeTabRightPanel}
                      />
                    );
                }
              }
              return (
                <Redirect
                  to={{
                    pathname: routes.project.detail.report.replace(
                      ":id",
                      `${id}`
                    ),
                    state: {
                      from: props.location,
                    },
                  }}
                />
              );
            }}
          />
          <Route
            exact
            path={routes.project.detail.target}
            render={(props) => {
              if (isAllowWatchEditableTabs === null) return null;
              if (isAllowWatchEditableTabs) {
                switch (project?.solution?.typeId) {
                  case ESOLUTION_TYPE.VIDEO_CHOICE:
                  case ESOLUTION_TYPE.PACK:
                  case ESOLUTION_TYPE.PRICE_TEST:
                    return (
                      <Target
                        {...props}
                        projectId={Number(id)}
                        isHaveChangePrice={isHaveChangePrice}
                        tabRightPanel={tabRightPanel}
                        toggleOutlineMobile={toggleOutlineMobile}
                        onToggleViewOutlineMobile={onToggleViewOutlineMobile}
                        onChangeTabRightPanel={onChangeTabRightPanel}
                      />
                    );
                  case ESOLUTION_TYPE.BRAND_TRACKING:
                    return (
                      <BrandTrackTarget
                        {...props}
                        projectId={Number(id)}
                        isHaveChangePrice={isHaveChangePrice}
                        tabRightPanel={tabRightPanel}
                        toggleOutlineMobile={toggleOutlineMobile}
                        onToggleViewOutlineMobile={onToggleViewOutlineMobile}
                        onChangeTabRightPanel={onChangeTabRightPanel}
                      />
                    );
                }
              }
              return (
                <Redirect
                  to={{
                    pathname: routes.project.detail.report.replace(
                      ":id",
                      `${id}`
                    ),
                    state: {
                      from: props.location,
                    },
                  }}
                />
              );
            }}
          />
          <Route
            exact
            path={routes.project.detail.quotas}
            render={(props) => {
              if (isAllowWatchEditableTabs === null) return null;
              if (isAllowWatchEditableTabs)
                return (
                  <Quotas
                    {...props}
                    projectId={Number(id)}
                    isHaveChangePrice={isHaveChangePrice}
                    tabRightPanel={tabRightPanel}
                    toggleOutlineMobile={toggleOutlineMobile}
                    onToggleViewOutlineMobile={onToggleViewOutlineMobile}
                    onChangeTabRightPanel={onChangeTabRightPanel}
                  />
                );
              return (
                <Redirect
                  to={{
                    pathname: routes.project.detail.report.replace(
                      ":id",
                      `${id}`
                    ),
                    state: {
                      from: props.location,
                    },
                  }}
                />
              );
            }}
          />
          <Route
            path={routes.project.detail.paymentBilling.root}
            render={(props) => {
              if (isAllowWatchEditableTabs === null) return null;
              if (isAllowWatchEditableTabs) {
                switch (project?.solution?.typeId) {
                  case ESOLUTION_TYPE.VIDEO_CHOICE:
                  case ESOLUTION_TYPE.PACK:
                  case ESOLUTION_TYPE.PRICE_TEST:
                    return <Pay {...props} projectId={Number(id)} />;
                  case ESOLUTION_TYPE.BRAND_TRACKING:
                    return <BrandTrackPay {...props} projectId={Number(id)} />;
                }
              }
              return (
                <Redirect
                  to={{
                    pathname: routes.project.detail.report.replace(
                      ":id",
                      `${id}`
                    ),
                    state: {
                      from: props.location,
                    },
                  }}
                />
              );
            }}
          />
          <Route
            exact
            path={routes.project.detail.report}
            render={(renderProps) => {
              switch (project?.solution?.typeId) {
                case ESOLUTION_TYPE.VIDEO_CHOICE:
                case ESOLUTION_TYPE.PACK:
                case ESOLUTION_TYPE.PRICE_TEST:
                  return <Report {...renderProps} projectId={Number(id)} />;
                case ESOLUTION_TYPE.BRAND_TRACKING:
                  return (
                    <BrandTrackReport {...renderProps} projectId={Number(id)} />
                  );
              }
            }}
          />

          <Redirect
            from={routes.project.detail.root}
            to={routes.project.detail.setupSurvey}
          />
        </Switch>
      </Box>
      <PopupShareProject
        isOpen={isOpenModalShare}
        onCancel={onCloseShowModalShareProject}
        project={project}
      />
    </Grid>
  );
};

export default Survey;
