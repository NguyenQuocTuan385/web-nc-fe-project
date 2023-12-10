import { useState, memo, useMemo, useEffect } from "react";
import classes from './styles.module.scss';
import { Tab, Badge } from "@mui/material";
import { ButtonViewQuestionnaire, Content, LeftContent, MobileAction, MobileOutline, ModalMobile, PageRoot, PageTitle, PageTitleLeft, PageTitleRight, PageTitleText, PriceChipStep, RPPriceWrapper, RightContent, RightPanel, RightPanelAction, RightPanelBody, RightPanelContent, TabRightPanel, ButtonHowToSetup } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { ReducerType } from "redux/reducers";
import LockIcon from "../components/LockIcon";
import { ArrowForward, ArrowCircleUpRounded, ArrowCircleDownRounded } from '@mui/icons-material';
import TabPanelBox from "components/TabPanelBox";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import CostSummary from "../components/CostSummary";
import BasicInformation from "./components/BasicInformation";
import ProjectHelper, { editableProject } from "helpers/project";
import { usePrice } from "helpers/price";
import { ETabRightPanel, SETUP_SURVEY_SECTION } from "models/project";
import UploadPacks from "./components/UploadPacks";
import AdditionalBrandList from "./components/AdditionalBrandList";
import AdditionalAttributes from "./components/AdditionalAttributes";
import CustomQuestions from "./components/CustomQuestions";
import EyeTracking from "./components/EyeTracking";
import { useTranslation } from "react-i18next";
import PopupMissingRequirement from "pages/SurveyNew/components/PopupMissingRequirement";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import PopupHowToSetupSurvey from "pages/SurveyNew/components/PopupHowToSetupSurvey";
import { setHowToSetupSurveyReducer, setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import ViewDetail from "components/icons/IconViewDetail";
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import PopupViewQuestionnaire from "../components/PopupViewQuestionnaire";
import { RightPanelStepper } from "../components/RightPanelStepper";
interface SetupSurvey {
  projectId: number;
  isHaveChangePrice: boolean;
  tabRightPanel: ETabRightPanel;
  toggleOutlineMobile: boolean;
  onToggleViewOutlineMobile: () => void;
  onChangeTabRightPanel: (tab: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const SetupSurvey = memo(({ projectId, isHaveChangePrice, tabRightPanel, toggleOutlineMobile, onToggleViewOutlineMobile, onChangeTabRightPanel }: SetupSurvey) => {
  
  const { t } = useTranslation();

  const dispatch = useDispatch()

  const { project, scrollToSection, showHowToSetup } = useSelector((state: ReducerType) => state.project)

  const { price } = usePrice()

  const editable = useMemo(() => editableProject(project), [project])
  
  const [openMissingRequirement, setOpenMissingRequirement] = useState(false);

  const [onOpenHowToSetupSurvey, setOnOpenHowToSetupSurvey] = useState(false);

  const [showPopupViewQuestionnaire, setShowPopupViewQuestionnaire] = useState<boolean>(false);

  const isValidBasic = useMemo(() => {
    return ProjectHelper.isValidBasic(project)
  }, [project])

  const isValidPacks = useMemo(() => {
    return ProjectHelper.isValidPacks(project)
  }, [project])

  const isValidAdditionalBrand = useMemo(() => {
    return ProjectHelper.isValidAdditionalBrand(project)
  }, [project])

  const isValidEyeTracking = useMemo(() => {
    return ProjectHelper.isValidEyeTracking(project)
  }, [project])

  const isValidSetup = useMemo(() => {
    return ProjectHelper.isValidSetup(project)
  }, [project])

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const content = document.getElementById(SETUP_SURVEY_SECTION.basic_information)
    document.getElementById(SETUP_SURVEY_SECTION.content_survey_setup).scrollTo({ behavior: 'smooth', top: el.offsetTop - content.offsetTop })
  }

  const onOpenPopupHowToSetupSurvey = () => {
    setOnOpenHowToSetupSurvey(true);
  }

  const onClosePopupViewQuestionnaire = () => {
    setShowPopupViewQuestionnaire(false);
  }

  const onClosePopupHowToSetupSurvey = () => {
    setOnOpenHowToSetupSurvey(false);
  }

  const onCloseMissingRequirement = () => {
    setOpenMissingRequirement(false)
  }

  const onOpenMissingRequirement = () => {
    setOpenMissingRequirement(true)
  }

  const onNextSetupTarget = () => {
    if (!editable || isValidSetup) {
      dispatch(push(routes.project.detail.target.replace(":id", `${projectId}`)))
    } else {
      onOpenMissingRequirement()
    }
  }

  useEffect(() => {
    if (scrollToSection) {
      scrollToElement(scrollToSection)
      dispatch(setScrollToSectionReducer(null))
    }
  }, [scrollToSection, dispatch])

  useEffect(() => {
    if (showHowToSetup && project?.solution) {
      if (project?.solution?.enableHowToSetUpSurvey) {
        onOpenPopupHowToSetupSurvey()
      }
      dispatch(setHowToSetupSurveyReducer(false))
    }
  }, [showHowToSetup, project, dispatch])
  
  return (
    <PageRoot className={classes.root}>
      <LeftContent>
        <PageTitle className={classes.pageTitle}>
          <PageTitleLeft>
            <PageTitleText sx={{fontWeight: "400 !important"}} translation-key="setup_survey_title_left_panel"
            dangerouslySetInnerHTML={{ __html: t('setup_survey_title_left_panel', {title: project?.solution?.title})}}
            ></PageTitleText>
            {!editable && <LockIcon status={project?.status} />}
          </PageTitleLeft>
          <PageTitleRight>
            
            {project?.solution?.previewQuestionnaireUrl && (
              <ButtonViewQuestionnaire
                fullWidth
                children={<ParagraphSmall $colorName="--gray-90" translation-key="setup_survey_view_questionnaire">{t('setup_survey_view_questionnaire')}</ParagraphSmall>}
                startIcon={<ViewDetail sx={{width: "16px", height:"17px"}}/>}
                onClick = {()=> {
                  setShowPopupViewQuestionnaire(true)
                }}
              />
            )}
            {project?.solution?.enableHowToSetUpSurvey && (
              <ButtonHowToSetup onClick={onOpenPopupHowToSetupSurvey}> 
                <ContactSupportOutlinedIcon /> 
              </ButtonHowToSetup>
            )} 
          </PageTitleRight>
           
        </PageTitle>
        <Content id={SETUP_SURVEY_SECTION.content_survey_setup}>
          <BasicInformation
            project={project}
          />
          <UploadPacks
            project={project}
          />
          <AdditionalBrandList
            project={project}
          />
          <AdditionalAttributes
            project={project}
          />
          {project?.solution?.enableCustomQuestion && (
            <CustomQuestions
              project={project}
              step={5}
            />
          )}
          {project?.solution?.enableEyeTracking && (
            <EyeTracking
              price={price}
              project={project}
              step={project?.solution?.enableCustomQuestion ? 6 : 5}
            />
          )}
        </Content>
        <MobileAction>
          <Button
            fullWidth
            btnType={BtnType.Raised}
            children={<TextBtnSecondary translation-key="setup_next_btn">{t("setup_next_btn")}</TextBtnSecondary>}
            endIcon={<ArrowForward />}
            padding="13px 8px !important"
            onClick={onNextSetupTarget}
          />
          <MobileOutline onClick={onToggleViewOutlineMobile}>
            <ParagraphSmall $colorName="--cimigo-blue" translation-key="common_btn_view_outline">{t("common_btn_view_outline")}</ParagraphSmall>
            <ArrowCircleUpRounded/>
          </MobileOutline>
          <ModalMobile $toggleOutlineMobile={toggleOutlineMobile}></ModalMobile>
        </MobileAction>
      </LeftContent>
      <RightContent $toggleOutlineMobile={toggleOutlineMobile}>
        <MobileOutline onClick={onToggleViewOutlineMobile}>
          <ParagraphSmall $colorName="--cimigo-blue" translation-key="common_btn_close_outline">{t("common_btn_close_outline")}</ParagraphSmall>
          <ArrowCircleDownRounded />
        </MobileOutline>
        <RightPanel>
          <TabRightPanel value={tabRightPanel} onChange={(_, value) => onChangeTabRightPanel(value)}>
            <Tab translation-key="project_right_panel_outline" label={t("project_right_panel_outline")} value={ETabRightPanel.OUTLINE} />
            <Tab label={<Badge color="secondary" variant="dot" invisible={!isHaveChangePrice} 
            translation-key="project_right_panel_cost_summary"
            >{t("project_right_panel_cost_summary")}</Badge>} value={ETabRightPanel.COST_SUMMARY} />
          </TabRightPanel>
          <TabPanelBox value={tabRightPanel} index={ETabRightPanel.OUTLINE}>
            <RightPanelContent className={classes.boxOutline}> 
              <RightPanelBody>
                <RightPanelStepper
                  steps={[
                    {
                      active: isValidBasic,
                      title: "project_right_panel_step_basic_info",
                      subTitle: "project_right_panel_step_basic_info_subtitle",
                      labelProps: {
                        onClick: () => scrollToElement(SETUP_SURVEY_SECTION.basic_information),
                      },
                    },
                    {
                      active: isValidPacks,
                      title: "project_right_panel_step_upload_packs",
                      titleOption: {packLength: project?.packs?.length || 0},
                      subTitle: "project_right_panel_step_upload_packs_subtitle",
                      labelProps: {
                        onClick: () => scrollToElement(SETUP_SURVEY_SECTION.upload_packs),
                      },
                      optional: ProjectHelper.minPack(project) < 1
                    },
                    {
                      active: isValidAdditionalBrand,
                      title: "project_right_panel_step_add_brands_list",
                      titleOption: {brandsLength: project?.additionalBrands?.length || 0},
                      subTitle: "project_right_panel_step_add_brands_list_subtitle",
                      labelProps: {
                        onClick: () => scrollToElement(SETUP_SURVEY_SECTION.additional_brand_list),
                      },
                      optional: ProjectHelper.minAdditionalBrand(project) < 1
                    },
                    {
                      active: (!!project?.projectAttributes?.length || !!project?.userAttributes?.length),
                      title: "project_right_panel_step_add_attributes",
                      subTitle: "project_right_panel_step_add_attributes_subtitle",
                      labelProps: {
                        onClick: () => scrollToElement(SETUP_SURVEY_SECTION.additional_attributes),
                      },
                      optional: true
                    },
                    ...(project?.solution?.enableCustomQuestion? [
                      { 
                        active: project?.enableCustomQuestion,
                        title: "project_right_panel_step_custom_question",
                        titleOption: {customQuestionLength: project?.customQuestions?.length || 0},
                        subTitle: "project_right_panel_step_custom_question_sub_title",
                        labelProps: {
                          onClick: () => scrollToElement(SETUP_SURVEY_SECTION.custom_questions),
                        },
                        content:(
                            <RPPriceWrapper>
                              <PriceChipStep 
                                $active={!!price?.customQuestionCost?.USD}
                                label={<ParagraphExtraSmall $colorName="--ghost-white">{!!price?.customQuestionCost?.USD ? price?.customQuestionCost?.show : `${t('setup_survey_custom_question_cost_description_right_panel')}`}</ParagraphExtraSmall>}/>
                            </RPPriceWrapper>
                        )
                      }
                    ]:[]),
                    ...(project?.solution?.enableEyeTracking ? [
                      { 
                        active: isValidEyeTracking && project?.enableEyeTracking,
                        title: "project_right_panel_step_eye_tracking",
                        titleOption: {customQuestionLength: project?.customQuestions?.length || 0},
                        subTitle: "project_right_panel_step_eye_tracking_sub_title",
                        labelProps: {
                          onClick: () => scrollToElement(SETUP_SURVEY_SECTION.eye_tracking),
                        },
                        content:(
                            <RPPriceWrapper>
                              <PriceChipStep 
                                $active={!!price?.eyeTrackingSampleSizeCost?.USD}
                                label={<ParagraphExtraSmall $colorName="--ghost-white">{!!price?.eyeTrackingSampleSizeCost?.USD ? price?.eyeTrackingSampleSizeCost?.show : `${t('setup_survey_custom_question_cost_description_right_panel')}`}</ParagraphExtraSmall>}/>
                            </RPPriceWrapper>
                        )
                      }
                    ]:[])
                  ]}
                />                       
              </RightPanelBody>
              <RightPanelAction>
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary translation-key="setup_next_btn">{t("setup_next_btn")}</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 8px !important"
                  onClick={onNextSetupTarget}
                />
              </RightPanelAction>
            </RightPanelContent>
          </TabPanelBox>
          <TabPanelBox value={tabRightPanel} index={ETabRightPanel.COST_SUMMARY}>
            <RightPanelContent>
              <RightPanelBody>
                <CostSummary
                  project={project}
                  price={price}
                />
              </RightPanelBody>
              <RightPanelAction> 
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary translation-key="setup_next_btn">{t("setup_next_btn")}</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 8px !important"
                  onClick={onNextSetupTarget}
                />
              </RightPanelAction>
            </RightPanelContent>
          </TabPanelBox>
        </RightPanel>
      </RightContent>

      <PopupViewQuestionnaire 
        isOpen={showPopupViewQuestionnaire}
        project={project}
        onClose={onClosePopupViewQuestionnaire}
      />
      
      <PopupHowToSetupSurvey
        isOpen={onOpenHowToSetupSurvey}
        project={project}
        onClose={onClosePopupHowToSetupSurvey}
      />
      <PopupMissingRequirement
        isOpen={openMissingRequirement}
        isValidBasic={isValidBasic}
        isValidPacks={isValidPacks}
        isValidAdditionalBrand={isValidAdditionalBrand}
        isValidEyeTracking={isValidEyeTracking}
        onClose={onCloseMissingRequirement}
        onScrollSection={(e) => {
          onCloseMissingRequirement()
          scrollToElement(e)
        }}
      />
    </PageRoot>
  )
})

export default SetupSurvey
