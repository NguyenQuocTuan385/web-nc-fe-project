import { memo, useEffect, useMemo, useState } from "react";
import { Grid, Box } from "@mui/material";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { ReducerType } from "redux/reducers";
import { authPreviewOrSelectDate } from "../models";
import { setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading5 from "components/common/text/Heading5";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading4 from "components/common/text/Heading4";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Footer from "components/Footer";
import ProjectHelper from "helpers/project";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { EBrandType } from "models/additional_brand";
import { Project, SETUP_SURVEY_SECTION } from "models/project";
import PopupConfirmQuotaAllocation from "pages/SurveyNew/components/AgreeQuotaWarning";
import { ProjectService } from "services/project";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { setProjectReducer } from "redux/reducers/Project/actionTypes";
import usePermissions from "hooks/usePermissions";
import useAuth from "hooks/useAuth";

interface ProjectReviewProps {}
// eslint-disable-next-line
const ProjectReview = memo(({}: ProjectReviewProps) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { project } = useSelector((state: ReducerType) => state.project);
  
  const isValidBasic = useMemo(() => ProjectHelper.isValidBasic(project) || 0, [project]);
  
  const mainBrands = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.MAIN) || [], [project]);
  
  const mainBrandNeedMore = useMemo(() => ProjectHelper.mainBrandNeedMore(project) || 0, [project]);
  
  const isValidMainBrand = useMemo(() => ProjectHelper.isValidMainBrand(project), [project]);
  
  const competingBrands = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.COMPETING) || [], [project]);
  
  const competingBrandNeedMore = useMemo(() => ProjectHelper.competingBrandNeedMore(project) || 0, [project]);
  
  const isValidCompetingBrand = useMemo(() => ProjectHelper.isValidCompetingBrand(project), [project]);
  
  const isValidBrandList = useMemo(() => ProjectHelper.isValidBrandList(project) || 0, [project]);
  
  const competitiveBrands = useMemo(() => project?.projectBrands || [], [project]);
  
  const competitiveBrandNeedMore = useMemo(() => ProjectHelper.competitiveBrandNeedMore(project) || 0, [project]);
  
  const isValidCompetitiveBrand = useMemo(() => ProjectHelper.isValidCompetitiveBrand(project), [project]);
  
  const numberOfBrandEquityAttributes = useMemo(() => project?.projectAttributes?.length + project?.userAttributes?.length || 0, [project]);
  
  const brandEquityAttributesNeedMore = useMemo(() => ProjectHelper.brandEquityAttributesNeedMore(project) || 0, [project]);
  
  const isValidBrandEquityAttributes = useMemo(() => ProjectHelper.isValidEquityAttributes(project), [project]);
  
  const isValidBrandDispositionAndEquity = useMemo(() => ProjectHelper.isValidBrandDispositionAndEquity(project) || 0, [project]);
  
  const brandAssetRecognitionNeedMore = useMemo(() => ProjectHelper.brandAssetRecognitionNeedMore(project) || 0, [project]);
  
  const isValidBrandAssetRecognition = useMemo(() => ProjectHelper.isValidBrandAssetRecognition(project) || 0, [project]);

  const [isShowConfirmQuotaAllocation, setIsShowConfirmQuotaAllocation] = useState<boolean>(false)

  const { isGuest } = useAuth();

  const onCloseConfirmQuotaAllocation = () => {
    setIsShowConfirmQuotaAllocation(false)
  }

  const onConfirmAgreeQuota = () => {
    if (ProjectHelper.isValidQuotas(project)) return
    dispatch(setLoading(true))
    return ProjectService.updateAgreeQuota(project.id, true)
      .then(() => {
        dispatch(setProjectReducer({ ...project, agreeQuota: true }))
        onCloseConfirmQuotaAllocation()
        dispatch(push(routes.project.detail.paymentBilling.previewAndPayment.selectDate.replace(":id", `${project.id}`)));
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const gotoQuotas = () => {
    dispatch(push(routes.project.detail.quotas.replace(':id', `${project.id}`)))
  }

  const gotoSetupSurvey = () => {
    dispatch(push(routes.project.detail.setupSurvey.replace(":id", `${project.id}`)));
  };

  const gotoTarget = () => {
    dispatch(push(routes.project.detail.target.replace(":id", `${project.id}`)));
  };

  const onGotoBasicInfor = (field?: keyof Project) => {
    if (isValidBasic) return
    dispatch(setScrollToSectionReducer(`${SETUP_SURVEY_SECTION.basic_information}-${field || ''}`))
    onRedirect(routes.project.detail.setupSurvey)
  }

  const onGotoBrandList = () => {
    if (isValidBrandList) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.brand_list))
    onRedirect(routes.project.detail.setupSurvey)
  }

  const onGotoBrandDispositionAndEquity = () => {
    if (isValidBrandDispositionAndEquity) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.brand_disposition_and_equity))
    onRedirect(routes.project.detail.setupSurvey)
  }

  const onGotoBrandAssetRecognition = () => {
    if (isValidBrandAssetRecognition) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.brand_asset_recognition))
    onRedirect(routes.project.detail.setupSurvey)
  }

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };

  const isValidCheckout = useMemo(() => {
    return ProjectHelper.isValidCheckout(project);
  }, [project]);

  const { isAllowPayment } = usePermissions()

  useEffect(() => {
    authPreviewOrSelectDate(project, onRedirect, isAllowPayment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isAllowPayment]);

  const onNextPayment = () => {
    if (!isValidCheckout || isGuest) return;
    if (!ProjectHelper.isValidQuotas(project)) {
      setIsShowConfirmQuotaAllocation(true)
      return
    }
    dispatch(push(routes.project.detail.paymentBilling.previewAndPayment.selectDate.replace(":id", `${project.id}`)));
  };

  const inValidTargetMess = () => {
    const mess: string[] = []
    if (!ProjectHelper.isValidTargetTabLocation(project)) mess.push(t('target_sub_tab_location'))
    if (!ProjectHelper.isValidTargetTabHI(project)) mess.push(t('target_sub_tab_household_income'))
    if (!ProjectHelper.isValidTargetTabAC(project)) mess.push(t('target_sub_tab_age_coverage'))
    return mess
  }

  const isValidTarget = useMemo(() => {
    return ProjectHelper.isValidTarget(project)
  }, [project])

  return (
    <>
      <Grid classes={{ root: classes.root }}>
        <Grid pt={4}>
          <Heading4 $colorName="--eerie-black" translation-key="brand_track_payment_billing_preview_title">{t("brand_track_payment_billing_preview_title")}</Heading4>
          {isValidCheckout ? (
            <ParagraphBody $colorName="--eerie-black" translation-key="brand_track_payment_billing_preview_sub_title_success">{t("brand_track_payment_billing_preview_sub_title_success")}</ParagraphBody>
          ) : (
            <ParagraphBody
              className={clsx(classes.title, classes.titleDanger)}
              $colorName="--eerie-black"
              dangerouslySetInnerHTML={{
                __html: t("brand_track_payment_billing_preview_sub_title_error"),
              }}
              translation-key="brand_track_payment_billing_preview_sub_title_error"
            />
          )}

          <Grid className={classes.content}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={0.5}>
                <Grid item xs={12} md={6}>
                  <Box className={classes.leftContent}>
                    <Grid className={classes.solution}>
                      <Heading5 $colorName={"--eerie-black"} className={classes.leftContentItemTitle} translation-key="brand_track_payment_billing_preview_solution">{t("brand_track_payment_billing_preview_solution")}</Heading5>
                      <Box className={clsx(classes.solutionItem, classes.leftContentItemDescription)}>
                        <img
                          src={project?.solution?.image}
                          alt="solution"
                        />
                        <ParagraphBody $colorName={"--eerie-black"} ml={0.5} className={classes.solutionTitle}>{project?.solution?.title}</ParagraphBody>
                      </Box>
                    </Grid>
                    <Grid className={classes.delivery}>
                      <Heading5 $colorName={"--eerie-black"} className={classes.leftContentItemTitle} translation-key="brand_track_payment_billing_preview_delivery_results">{t("brand_track_payment_billing_preview_delivery_results")}</Heading5>
                      <ParagraphBody $colorName={"--eerie-black"} className={classes.leftContentItemDescription} translation-key="brand_track_payment_billing_preview_delivery_results_detail">
                        {t("brand_track_payment_billing_preview_delivery_results_detail")}
                      </ParagraphBody>
                    </Grid>
                    <Grid className={classes.contentSampleAndTarget}>
                      <Grid className={classes.sampleTarget}>
                        <Heading5 $colorName={"--eerie-black"} translation-key="brand_track_payment_billing_preview_sample_and_target">{t("brand_track_payment_billing_preview_sample_and_target")}</Heading5>
                        <Button
                          className={classes.customBtnContentPayment}
                          children={<span className={classes.titleBtn} translation-key="brand_track_payment_billing_preview_edit_setup">{t("brand_track_payment_billing_preview_edit_setup")}</span>}
                          endIcon={<KeyboardArrowRightIcon />}
                          onClick={gotoTarget}
                        />
                      </Grid>
                      <Grid className={classes.contentSampleTarget} pl={2} mt={2}>
                        <Box className={classes.value} pt={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} className={classes.customGridItem} pl={3}>
                              <ParagraphBody $colorName={"--eerie-black"} translation-key="brand_track_payment_billing_preview_sample_size">{t("brand_track_payment_billing_preview_sample_size")}</ParagraphBody>
                            </Grid>
                            <Grid item xs={6} className={classes.customGridItem}>
                              <ParagraphBody $colorName={"--eerie-black"} translation-key="brand_track_payment_billing_preview_sample_size_detail">{t("brand_track_payment_billing_preview_sample_size_detail", { number: project?.sampleSize })}</ParagraphBody>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} pt={2}>
                            <Grid item xs={6} pl={3}>
                              <ParagraphBody $colorName={"--eerie-black"} translation-key="brand_track_payment_billing_preview_target_criteria">{t("brand_track_payment_billing_preview_target_criteria")}</ParagraphBody>
                            </Grid>
                            <Grid item xs={6}>
                              <Box className={classes.itemSubRight}>
                                {
                                  !isValidTarget ? (
                                    <Box className={clsx({ [classes.dangerText]: !isValidTarget })}>
                                      <Box sx={{ fontWeight: 600, fontSize: "14px" }} component="span" translation-key="payment_billing_sub_tab_preview_solution">
                                        {t('payment_billing_sub_tab_preview_missing_setup')}:
                                      </Box>
                                      <Box sx={{ fontWeight: 600, fontSize: "14px", textTransform: "lowercase" }} component="span" ml={1}>
                                        {inValidTargetMess()?.join(', ')}
                                      </Box>
                                    </Box>
                                  ) : (
                                    <ParagraphSmallUnderline2 $colorName={"--cimigo-blue"} onClick={gotoTarget} sx={{maxWidth: "max-content"}} translation-key="common_view_detail">{t("common_view_detail")}</ParagraphSmallUnderline2>
                                  )
                                }
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className={classes.rightContent}>
                    <Grid className={classes.survey}>
                      <Heading5 $colorName={"--eerie-black"} translation-key="brand_track_payment_billing_preview_survey_detail">{t("brand_track_payment_billing_preview_survey_detail")}</Heading5>
                      <Button
                        className={classes.customBtnContentPayment}
                        children={<span className={classes.titleBtn} translation-key="brand_track_payment_billing_preview_edit_setup">{t("brand_track_payment_billing_preview_edit_setup")}</span>}
                        endIcon={<KeyboardArrowRightIcon />}
                        onClick={gotoSetupSurvey}
                      />
                    </Grid>
                    <Grid container spacing={2} className={classes.rightContent2}>
                      <Grid item container className={classes.customGridItem}>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"} translation-key="brand_track_payment_billing_preview_brand_category">{t("brand_track_payment_billing_preview_brand_category")}</ParagraphBody>
                        </Grid>
                        <Grid item xs={6}>
                          {project?.category ? (
                            <ParagraphBody 
                              $colorName={"--eerie-black-00"} 
                              className={clsx({[classes.dangerText]: !isValidBasic})}
                            >
                              {project?.category}
                            </ParagraphBody>
                          ) : (
                            <ParagraphBody 
                              $colorName={"--eerie-black-00"} 
                              className={clsx({[classes.dangerText]: !isValidBasic})}
                              onClick={() => onGotoBasicInfor("category")}
                              translation-key="common_undefined"
                            >
                              {t("common_undefined")}
                            </ParagraphBody>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"} translation-key="brand_track_payment_billing_preview_brand_list">{t("brand_track_payment_billing_preview_brand_list")}</ParagraphBody>
                        </Grid>
                        <Grid item xs={6}>
                          {mainBrands?.map((item) => (
                            <ParagraphBody key={item?.id} $colorName={"--eerie-black-00"} className={classes.mainBrandItem}>
                              {item?.brand}
                            </ParagraphBody>
                          ))}
                          {!mainBrands?.length && (
                            <ParagraphBody 
                              $colorName={"--eerie-black-00"} 
                              className={classes.numberOfItem}
                              translation-key="brand_track_payment_billing_preview_number_main_brand"
                              dangerouslySetInnerHTML={{
                                __html: t("brand_track_payment_billing_preview_number_main_brand", {number: 0}),
                              }}
                            ></ParagraphBody>
                            )}
                          {!!competingBrands?.length && (
                            <ParagraphBody $colorName={"--eerie-black-00"} translation-key="common_more">+ {t("common_more", {number: competingBrands?.length})}</ParagraphBody>
                          )}
                          {!isValidMainBrand && (
                            <ParagraphSmall className={classes.dangerText} onClick={onGotoBrandList} translation-key="brand_track_payment_billing_preview_main_brand_need_more">
                              {t("brand_track_payment_billing_preview_main_brand_need_more", {number: mainBrandNeedMore})}
                            </ParagraphSmall>
                          )}
                          {!isValidCompetingBrand && (
                            <ParagraphSmall className={classes.dangerText} onClick={onGotoBrandList} translation-key="brand_track_payment_billing_preview_competing_brand_need_more">
                              {t("brand_track_payment_billing_preview_competing_brand_need_more", {number: competingBrandNeedMore})}
                            </ParagraphSmall>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"} translation-key="brand_track_payment_billing_preview_brand_disposition_and_equity">{t("brand_track_payment_billing_preview_brand_disposition_and_equity")}</ParagraphBody>
                        </Grid>
                        <Grid item xs={6}>
                          <ParagraphBody 
                            $colorName={"--eerie-black-00"} 
                            className={classes.numberOfItem}
                            translation-key="brand_track_payment_billing_preview_number_competitive_brand"
                            dangerouslySetInnerHTML={{
                              __html: t("brand_track_payment_billing_preview_number_competitive_brand", {number: competitiveBrands?.length}),
                            }}
                          ></ParagraphBody>
                          <ParagraphBody 
                            $colorName={"--eerie-black-00"} 
                            className={classes.numberOfItem}
                            translation-key="brand_track_payment_billing_preview_number_equity_attribute"
                            dangerouslySetInnerHTML={{
                              __html: t("brand_track_payment_billing_preview_number_equity_attribute", {number: numberOfBrandEquityAttributes}),
                            }}
                          ></ParagraphBody>
                          {!isValidCompetitiveBrand && (
                            <ParagraphSmall className={classes.dangerText} onClick={onGotoBrandDispositionAndEquity} translation-key="brand_track_payment_billing_preview_competitive_need_more">
                              {t("brand_track_payment_billing_preview_competitive_need_more", {number: competitiveBrandNeedMore})}
                            </ParagraphSmall>
                          )}
                          {!isValidBrandEquityAttributes && (
                            <ParagraphSmall className={classes.dangerText} onClick={onGotoBrandDispositionAndEquity} translation-key="brand_track_payment_billing_preview_equity_attribute_need_more">
                              {t("brand_track_payment_billing_preview_equity_attribute_need_more", {number: brandEquityAttributesNeedMore})}
                            </ParagraphSmall>
                          )}
                        </Grid>
                      </Grid>
                      {
                        (!!project?.brandAssets?.length || !isValidBrandAssetRecognition) && (
                          <Grid item container>
                            <Grid item xs={6}>
                              <ParagraphBody $colorName={"--eerie-black-00"} translation-key="brand_track_payment_billing_preview_brand_assets">{t("brand_track_payment_billing_preview_brand_assets")}</ParagraphBody>
                            </Grid>
                            <Grid item xs={6}>
                              {
                                <ParagraphBody
                                  $colorName={"--eerie-black-00"}
                                  className={classes.numberOfItem}
                                  translation-key="brand_track_payment_billing_preview_number_brand_asset"
                                  dangerouslySetInnerHTML={{
                                    __html: t("brand_track_payment_billing_preview_number_brand_asset", { number: project?.brandAssets?.length }),
                                  }}
                                ></ParagraphBody>
                              }
                              {!isValidBrandAssetRecognition && (
                                <ParagraphSmall className={classes.dangerText} onClick={onGotoBrandAssetRecognition} translation-key="brand_track_payment_billing_preview_brand_asset_need_more">
                                  {t("brand_track_payment_billing_preview_brand_asset_need_more", { number: brandAssetRecognitionNeedMore })}
                                </ParagraphSmall>
                              )}
                            </Grid>
                          </Grid>
                        )
                      }
                      {
                        !!project?.customQuestions?.length && (
                          <Grid item container>
                            <Grid item xs={6}>
                              <ParagraphBody $colorName={"--eerie-black-00"} translation-key="brand_track_payment_billing_preview_custom_question">{t("brand_track_payment_billing_preview_custom_question")}</ParagraphBody>
                            </Grid>
                            <Grid item xs={6}>
                              <ParagraphBody
                                $colorName={"--eerie-black-00"}
                                className={classes.numberOfItem}
                                translation-key="brand_track_payment_billing_preview_number_custom_question"
                                dangerouslySetInnerHTML={{
                                  __html: t("brand_track_payment_billing_preview_number_custom_question", { number: project?.customQuestions?.length }),
                                }}
                              ></ParagraphBody>
                            </Grid>
                          </Grid>
                        )
                      }
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {
            !!isAllowPayment && (
              <>
                <Grid mt={3} className={classes.btn}>
                  <Button
                    disabled={!isValidCheckout || isGuest}
                    btnType={BtnType.Primary}
                    children={<TextBtnSecondary translation-key="common_next">{t("common_next")}</TextBtnSecondary>}
                    onClick={onNextPayment}
                  />
                </Grid>
                {isGuest ? (
                  <ParagraphSmall className={classes.disBtn} $colorName={"--gray-60"} translation-key="payment_billing_sub_tab_preview_guest_des">
                    {t("payment_billing_sub_tab_preview_guest_des")}
                  </ParagraphSmall>
                ) : (
                  <ParagraphSmall className={classes.disBtn} $colorName={"--gray-60"} translation-key="brand_track_payment_billing_preview_next">
                    {t("brand_track_payment_billing_preview_next")}
                  </ParagraphSmall>
                )}
              </>
            )
          }       
        </Grid>
        <PopupConfirmQuotaAllocation
          isOpen={isShowConfirmQuotaAllocation}
          onCancel={onCloseConfirmQuotaAllocation}
          onConfirm={onConfirmAgreeQuota}
          onRedirectQuotas={() => gotoQuotas()}
        />
      </Grid>
      <Footer />
    </>
  );
});

export default ProjectReview;