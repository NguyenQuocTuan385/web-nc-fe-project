import { memo, useMemo, useEffect, useState } from "react";
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
import BasicInformation from "./components/BasicInformation";
import ProjectHelper, { editableProject } from "helpers/project";
import { usePrice } from "helpers/price";
import { ETabRightPanel, SETUP_SURVEY_SECTION } from "models/project";
import BrandList from "./components/BrandList";
import BrandDispositionAndEquity from "./components/BrandDispositionAndEquity";
import BrandAssetRecognition from "./components/BrandAssetRecognition";
import { useTranslation } from "react-i18next";
import { setHowToSetupSurveyReducer, setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import PopupHowToSetupSurvey from "../components/PopupHowToSetupSurvey";
import PopupMissingRequirement from "./components/PopupMissingRequirement";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import CostSummaryBrandTrack from "../components/CostSummaryBrandTrack";
import CustomQuestions from "../SetupSurvey/components/CustomQuestions";
import { EBrandType } from "models/additional_brand";
import ViewDetail from "components/icons/IconViewDetail";
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import PopupViewQuestionnaire from "../components/PopupViewQuestionnaire";
import { RightPanelStepper } from "../components/RightPanelStepper";
import { RPStepTextContent } from "../components/RightPanelStepper/components";

interface SetupSurvey {
  projectId: number;
  isHaveChangePrice: boolean;
  tabRightPanel: ETabRightPanel;
  toggleOutlineMobile: boolean;
  onToggleViewOutlineMobile: () => void;
  onChangeTabRightPanel: (tab: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const BrandTrack = memo(({ projectId, isHaveChangePrice, tabRightPanel, toggleOutlineMobile, onToggleViewOutlineMobile, onChangeTabRightPanel }: SetupSurvey) => {
  
  const { t } = useTranslation();

  const dispatch = useDispatch()
  
  const { project, scrollToSection, showHowToSetup } = useSelector((state: ReducerType) => state.project)

  const mainBrands = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.MAIN) || [], [project])
  const competingBrands = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.COMPETING) || [], [project])
  const competitiveBrands = useMemo(() => project?.projectBrands || [], [project])
  const numberOfBrandEquityAttributes = useMemo(() => project?.projectAttributes?.length + project?.userAttributes?.length || 0, [project])
  const minBrandAssetRecognition = useMemo(() => ProjectHelper.minBrandAssetRecognition(project) || 0, [project])
  const brandAssets = useMemo(() => project?.brandAssets || [], [project])

  const [openMissingRequirement, setOpenMissingRequirement] = useState(false);
  const [onOpenHowToSetupSurvey, setOnOpenHowToSetupSurvey] = useState(false);

  const [showPopupViewQuestionnaire, setShowPopupViewQuestionnaire] = useState<boolean>(false);
  
  const { price } = usePrice()
  
  const editable = useMemo(() => editableProject(project), [project])
  const isValidBasic = useMemo(() => {
    return ProjectHelper.isValidBasic(project)
  }, [project])

  const isValidBrandList = useMemo(() => {
    return ProjectHelper.isValidBrandList(project)
  }, [project])

  const isValidBrandDispositionAndEquity = useMemo(() => {
    return ProjectHelper.isValidBrandDispositionAndEquity(project)
  }, [project])

  const isValidBrandAssetRecognition = useMemo(() => {
    return ProjectHelper.isValidBrandAssetRecognition(project)
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
            <PageTitleText sx={{fontWeight: "400 !important"}} translation-key="brand_track_setup_title">{t("brand_track_setup_title")}</PageTitleText>
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
                <ButtonHowToSetup  onClick={onOpenPopupHowToSetupSurvey}> 
                  <ContactSupportOutlinedIcon  /> 
                </ButtonHowToSetup>
            )} 
          </PageTitleRight> 
        </PageTitle>
        <Content id={SETUP_SURVEY_SECTION.content_survey_setup}>
          <BasicInformation
            project={project}
          />
          <BrandList
            project={project}
          />
          <BrandDispositionAndEquity
            project={project}
          />
          <BrandAssetRecognition
            project={project}
          />
          {project?.solution?.enableCustomQuestion && (
            <CustomQuestions
              project={project}
              step={5}
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
                      title: "brand_track_right_panel_step_brand_category",
                      subTitle: "brand_track_right_panel_step_brand_category_sub_title",
                      labelProps: {
                        onClick: () => scrollToElement(SETUP_SURVEY_SECTION.basic_information)
                      },

                    },
                    {
                      active: isValidBrandList,
                      title: "brand_track_right_panel_step_brand_list",
                      labelProps: {
                        onClick: () => scrollToElement(SETUP_SURVEY_SECTION.brand_list)
                      },
                      subTitle: "brand_track_right_panel_step_brand_list_sub_title",
                      content: (
                        <>
                          {mainBrands?.map(item => (
                            <RPStepTextContent key={item?.id} $bold>{item?.brand}</RPStepTextContent>
                          ))}
                          {competingBrands?.length > 0 && (
                          <RPStepTextContent translation-key="brand_track_right_panel_step_brand_list_detail">{t("brand_track_right_panel_step_brand_list_detail", {number: competingBrands?.length})}</RPStepTextContent>
                          )}
                        </>
                      )
                    },
                    {
                      active: isValidBrandDispositionAndEquity,
                      title: "brand_track_right_panel_step_brand_disposition_and_equity",
                      labelProps: {
                        onClick: () => scrollToElement(SETUP_SURVEY_SECTION.brand_disposition_and_equity)
                      },
                      subTitle: "brand_track_right_panel_step_brand_disposition_and_equity_sub_title",
                      content: (
                        <>
                          {competitiveBrands?.length > 0 && (
                            <RPStepTextContent
                              className={classes.outlineSectionDescription}
                              translation-key="brand_track_right_panel_step_brand_disposition_and_equity_detail_1"
                              dangerouslySetInnerHTML={{
                                __html: t("brand_track_right_panel_step_brand_disposition_and_equity_detail_1", {number: competitiveBrands?.length}),
                              }}
                            ></RPStepTextContent>
                          )}
                          {numberOfBrandEquityAttributes > 0 && (
                            <RPStepTextContent 
                              className={classes.outlineSectionDescription}
                              translation-key="brand_track_right_panel_step_brand_disposition_and_equity_detail_2"
                              dangerouslySetInnerHTML={{
                                __html: t("brand_track_right_panel_step_brand_disposition_and_equity_detail_2", {number: numberOfBrandEquityAttributes}),
                              }}
                            ></RPStepTextContent>
                          )}
                        </>
                      )
                    },
                    {
                      active: isValidBrandAssetRecognition,
                      title: "brand_track_right_panel_step_brand_assets",
                      labelProps: {
                        onClick: () => scrollToElement(SETUP_SURVEY_SECTION.brand_asset_recognition)
                      },
                      optional: minBrandAssetRecognition < 1,
                      content: (
                        <>
                          {brandAssets?.length > 0 && (
                            <RPStepTextContent
                              translation-key="brand_track_right_panel_step_brand_assets_detail"
                              className={classes.outlineSectionDescription}
                              dangerouslySetInnerHTML={{
                                __html: t("brand_track_right_panel_step_brand_assets_detail", {number: brandAssets?.length}),
                              }}
                            ></RPStepTextContent>
                          )}
                        </>
                      )
                    },
                    ...(project?.solution?.enableCustomQuestion ? [{
                      active: project?.enableCustomQuestion,
                      title: "common_custom_question",
                      labelProps: {
                        onClick: () => scrollToElement(SETUP_SURVEY_SECTION.custom_questions)
                      },
                      subTitle: "brand_track_right_panel_step_custom_question_sub_title",
                      content: (
                          <RPPriceWrapper>
                            <PriceChipStep 
                              $active={!!price?.customQuestionCost?.USD}
                              label={<ParagraphExtraSmall $colorName="--ghost-white">{price?.customQuestionCost?.USD ? price?.customQuestionCost?.show : `${t('setup_survey_custom_question_cost_description_right_panel')}`  }</ParagraphExtraSmall>}/>
                            {project?.customQuestions?.length > 0 && (
                              <ParagraphExtraSmall $colorName={"--eerie-black"} translation-key="brand_track_right_panel_step_custom_question_detail">{t("brand_track_right_panel_step_custom_question_detail", {number: project?.customQuestions?.length})}</ParagraphExtraSmall>
                            )}
                          </RPPriceWrapper>
                      )
                    }] : [])
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
                <CostSummaryBrandTrack
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
        isValidBrandList={isValidBrandList}
        isValidBrandDispositionAndEquity={isValidBrandDispositionAndEquity}
        isValidBrandAssetRecognition={isValidBrandAssetRecognition}
        onClose={onCloseMissingRequirement}
        onScrollSection={(e) => {
          onCloseMissingRequirement()
          scrollToElement(e)
        }}
      />
    </PageRoot>
  )
})

export default BrandTrack
