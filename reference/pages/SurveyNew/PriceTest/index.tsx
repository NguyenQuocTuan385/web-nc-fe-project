import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonHowToSetup,
  ButtonViewQuestionnaire,
  Content,
  LeftContent,
  MobileAction,
  MobileOutline,
  ModalMobile,
  PageRoot,
  PageTitle,
  PageTitleLeft,
  PageTitleRight,
  PageTitleText,
  PriceChipStep,
  RPPriceWrapper,
  RightContent,
  RightPanel,
  RightPanelAction,
  RightPanelBody,
  RightPanelContent,
  TabRightPanel,
} from '../components';
import classes from './styles.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import { ETabRightPanel, SETUP_SURVEY_SECTION } from 'models/project';
import BasicInformation from './components/BasicInformation';
import { Badge, Tab } from '@mui/material';
import TabPanelBox from 'components/TabPanelBox';
import { RightPanelStepper } from '../components/RightPanelStepper';
import ParagraphExtraSmall from 'components/common/text/ParagraphExtraSmall';
import { usePrice } from 'helpers/price';
import CustomQuestions from '../SetupSurvey/components/CustomQuestions';
import ProjectHelper, { editableProject } from 'helpers/project';
import Button, { BtnType } from 'components/common/buttons/Button';
import {
  ArrowCircleDownRounded,
  ArrowCircleUpOutlined,
  ArrowForward,
} from '@mui/icons-material';
import TextBtnSecondary from 'components/common/text/TextBtnSecondary';
import CostSummary from '../components/CostSummary';
import PopupMissingRequirement from './components/PopupMissingRequirement';
import {
  setScrollToSectionReducer,
  setTriggerValidate,
} from 'redux/reducers/Project/actionTypes';
import { routes } from 'routers/routes';
import { push } from 'connected-react-router';
import PopupViewQuestionnaire from '../components/PopupViewQuestionnaire';
import PopupHowToSetupSurvey from '../components/PopupHowToSetupSurvey';
import LockIcon from '../components/LockIcon';

interface PriceTestProps {
  projectId: number;
  isHaveChangePrice: boolean;
  tabRightPanel: ETabRightPanel;
  toggleOutlineMobile: boolean;
  onToggleViewOutlineMobile: () => void;
  onChangeTabRightPanel: (tab: number) => void;
}
const PriceTest = memo(
  ({
    projectId,
    isHaveChangePrice,
    tabRightPanel,
    toggleOutlineMobile,
    onToggleViewOutlineMobile,
    onChangeTabRightPanel,
  }: PriceTestProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { price } = usePrice();
    const { project, scrollToSection, showHowToSetup } = useSelector(
      (state: ReducerType) => state.project
    );
    const [openMissingRequirement, setOpenMissingRequirement] = useState(false);
    const [onOpenHowToSetupSurvey, setOnOpenHowToSetupSurvey] = useState(false);
    const [showPopupViewQuestionnaire, setShowPopupViewQuestionnaire] = useState<boolean>(false);

    const editable = useMemo(() => editableProject(project), [project])

    const onCloseMissingRequirement = () => {
      setOpenMissingRequirement(false);
    };

    const onOpenMissingRequirement = () => {
      setOpenMissingRequirement(true);
    };

    const onOpenPopupHowToSetupSurvey = () => {
      setOnOpenHowToSetupSurvey(true);
    };

    const onClosePopupViewQuestionnaire = () => {
      setShowPopupViewQuestionnaire(false);
    };

    const onClosePopupHowToSetupSurvey = () => {
      setOnOpenHowToSetupSurvey(false);
    };

    const isValidSetup = useMemo(() => {
      return ProjectHelper.isValidSetup(project);
    }, [project]);

    const isValidPriceTestInfo = useMemo(() => {
      return ProjectHelper.isValidPriceTestInfo(project);
    }, [project]);

    const isValidDescription = useMemo(() => {
      return ProjectHelper.isValidPriceTestDescription(project);
    }, [project]);

    const isValidPicture = useMemo(() => {
      return ProjectHelper.isValidPriceTestPicture(project);
    }, [project]);

    const isValidPriceSetup = useMemo(() => {
      return ProjectHelper.isValidPriceTestPriceSetup(project);
    }, [project]);

    const scrollToElement = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const content = document.getElementById(
        SETUP_SURVEY_SECTION.basic_information
      );
      document
        .getElementById(SETUP_SURVEY_SECTION.content_survey_setup)
        .scrollTo({
          behavior: 'smooth',
          top: el.offsetTop - content.offsetTop,
        });
    };

    useEffect(() => {
      if (scrollToSection) {
        scrollToElement(scrollToSection);
        dispatch(setScrollToSectionReducer(null));
      }
    }, [scrollToSection, dispatch]);

    const onNextSetupTarget = () => {
      dispatch(setTriggerValidate());
      if (!editable || isValidSetup) {
        dispatch(
          push(routes.project.detail.target.replace(':id', `${projectId}`))
        );
      } else {
        onOpenMissingRequirement();
      }
    };

    return (
      <PageRoot className={classes.PageRoot}>
        <LeftContent>
          <PageTitle>
            <PageTitleLeft>
              <PageTitleText
                translation-key="setup_survey_title_left_panel"
                dangerouslySetInnerHTML={{
                  __html: t('setup_survey_title_left_panel', {
                    title: project?.solution?.title,
                  }),
                }}
              />
              {!editable && <LockIcon status={project?.status} />}
            </PageTitleLeft>
            <PageTitleRight>
              {project?.solution?.previewQuestionnaireUrl && (
                <ButtonViewQuestionnaire
                  fullWidth
                  children={
                    <ParagraphSmall
                      $colorName="--gray-90"
                      translation-key="setup_survey_view_questionnaire"
                    >
                      {t('setup_survey_view_questionnaire')}
                    </ParagraphSmall>
                  }
                  onClick={() => {
                    setShowPopupViewQuestionnaire(true);
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
            <BasicInformation step={1} project={project} />
            {project?.solution?.enableCustomQuestion && (
              <CustomQuestions project={project} step={2} />
            )}
          </Content>
          <MobileAction>
            <Button
              fullWidth
              btnType={BtnType.Raised}
              children={
                <TextBtnSecondary translation-key="setup_next_btn">
                  {t('setup_next_btn')}
                </TextBtnSecondary>
              }
              endIcon={<ArrowForward />}
              padding="13px 8px !important"
              onClick={onNextSetupTarget}
            />
            <MobileOutline onClick={onToggleViewOutlineMobile}>
              <ParagraphSmall
                $colorName="--cimigo-blue"
                translation-key="common_btn_view_outline"
              >
                {t('common_btn_view_outline')}
              </ParagraphSmall>
              <ArrowCircleUpOutlined />
            </MobileOutline>
            <ModalMobile
              $toggleOutlineMobile={toggleOutlineMobile}
            ></ModalMobile>
          </MobileAction>
        </LeftContent>
        <RightContent $toggleOutlineMobile={toggleOutlineMobile}>
          <MobileOutline onClick={onToggleViewOutlineMobile}>
            <ParagraphSmall
              $colorName="--cimigo-blue"
              translation-key="common_btn_close_outline"
            >
              {t('common_btn_close_outline')}
            </ParagraphSmall>
            <ArrowCircleDownRounded />
          </MobileOutline>
          <RightPanel>
            <TabRightPanel
              value={tabRightPanel}
              onChange={(_, value) => onChangeTabRightPanel(value)}
            >
              <Tab
                translation-key="project_right_panel_outline"
                label={t('project_right_panel_outline')}
                value={ETabRightPanel.OUTLINE}
              />
              <Tab
                label={
                  <Badge
                    color="secondary"
                    variant="dot"
                    invisible={!isHaveChangePrice}
                    translation-key="project_right_panel_cost_summary"
                  >
                    {t('project_right_panel_cost_summary')}
                  </Badge>
                }
                value={ETabRightPanel.COST_SUMMARY}
              />
            </TabRightPanel>
            <TabPanelBox value={tabRightPanel} index={ETabRightPanel.OUTLINE}>
              <RightPanelContent className={classes.boxOutline}>
                <RightPanelBody>
                  <RightPanelStepper
                    steps={[
                      {
                        active: isValidPriceTestInfo,
                        title: 'price_test_right_panel_step_information_title',
                        subTitle:
                          'price_test_right_panel_step_information_subtitle',
                        labelProps: {
                          onClick: () =>
                            scrollToElement(
                              SETUP_SURVEY_SECTION.basic_information
                            ),
                        },
                      },
                      ...(project?.solution?.enableCustomQuestion
                        ? [
                            {
                              active: project?.enableCustomQuestion,
                              title: 'common_custom_question',
                              labelProps: {
                                onClick: () =>
                                  scrollToElement(
                                    SETUP_SURVEY_SECTION.custom_questions
                                  ),
                              },
                              subTitle:
                                'brand_track_right_panel_step_custom_question_sub_title',
                              content: (
                                <RPPriceWrapper>
                                  <PriceChipStep
                                    $active={!!price?.customQuestionCost?.USD}
                                    label={
                                      <ParagraphExtraSmall $colorName="--ghost-white">
                                        {price?.customQuestionCost?.USD
                                          ? price?.customQuestionCost?.show
                                          : `${t(
                                              'setup_survey_custom_question_cost_description_right_panel'
                                            )}`}
                                      </ParagraphExtraSmall>
                                    }
                                  />
                                  {project?.customQuestions?.length > 0 && (
                                    <ParagraphExtraSmall
                                      $colorName={'--eerie-black'}
                                      translation-key="brand_track_right_panel_step_custom_question_detail"
                                    >
                                      {t(
                                        'brand_track_right_panel_step_custom_question_detail',
                                        {
                                          number:
                                            project?.customQuestions?.length,
                                        }
                                      )}
                                    </ParagraphExtraSmall>
                                  )}
                                </RPPriceWrapper>
                              ),
                            },
                          ]
                        : []),
                    ]}
                  />
                </RightPanelBody>
                <RightPanelAction>
                  <Button
                    fullWidth
                    btnType={BtnType.Raised}
                    children={
                      <TextBtnSecondary translation-key="setup_next_btn">
                        {t('setup_next_btn')}
                      </TextBtnSecondary>
                    }
                    endIcon={<ArrowForward />}
                    padding="13px 8px !important"
                    onClick={onNextSetupTarget}
                  />
                </RightPanelAction>
              </RightPanelContent>
            </TabPanelBox>
            <TabPanelBox
              value={tabRightPanel}
              index={ETabRightPanel.COST_SUMMARY}
            >
              <RightPanelContent>
                <RightPanelBody>
                  <CostSummary project={project} price={price} />
                </RightPanelBody>
                <RightPanelAction>
                  <Button
                    fullWidth
                    btnType={BtnType.Raised}
                    children={
                      <TextBtnSecondary translation-key="setup_next_btn">
                        {t('setup_next_btn')}
                      </TextBtnSecondary>
                    }
                    endIcon={<ArrowForward />}
                    padding="13px 8px !important"
                    onClick={onNextSetupTarget}
                  />
                </RightPanelAction>
              </RightPanelContent>
            </TabPanelBox>
          </RightPanel>
        </RightContent>
        <PopupMissingRequirement
          isOpen={openMissingRequirement}
          isValidDescription={isValidDescription}
          isValidPicture={isValidPicture}
          isValidPriceSetup={isValidPriceSetup}
          typeTitle={project?.priceTest?.typeId}
          onScrollSection={(e) => {
            onCloseMissingRequirement();
            scrollToElement(e);
          }}
          onClose={onCloseMissingRequirement}
        />
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
      </PageRoot>
    );
  }
);
export default PriceTest;
