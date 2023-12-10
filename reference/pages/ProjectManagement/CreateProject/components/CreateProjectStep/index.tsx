import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Heading1 from "components/common/text/Heading1";
import Heading5 from "components/common/text/Heading5";

import { memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputSelect from "components/common/inputs/InputSelect";
import { OptionItemT, Lang, langOptions } from "models/general";
import InputTextfield from "components/common/inputs/InputTextfield";
import ParagraphBody from "components/common/text/ParagraphBody";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { Solution } from "models/Admin/solution";
import { Plan } from "models/Admin/plan";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { ProjectService } from "services/project";
import { Project } from "models/project";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { EStep } from "../..";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import Button, { BtnType } from "components/common/buttons/Button";
import { setHowToSetupSurveyReducer } from "redux/reducers/Project/actionTypes";
import { usePrice } from "helpers/price";
import { EPRICE_TEST_TYPE_ID, ESOLUTION_TYPE } from "models";
import { DataPagination } from "models/general";
import { SelectPriceTestType } from "pages/ProjectManagement/CreateProject/components/SelectPriceTestType";

export interface CreateProjectFormData {
  name: string;
  surveyLanguage: OptionItemT<string>;
  category: string;
  priceTestTypeId: EPRICE_TEST_TYPE_ID;
}

interface CreateProjectStepProps {
  solutionSelected?: Solution;
  planSelected?: Plan;
  plan?: DataPagination<Plan>;
  onClickHandleBack?: (step: number) => void;
}

const CreateProjectStep = memo(
  ({
    solutionSelected,
    planSelected,
    plan,
    onClickHandleBack,
  }: CreateProjectStepProps) => {

    const { t, i18n } = useTranslation();
    
    const dispatch = useDispatch();

    const { getCostCurrency } = usePrice()

    const schema = useMemo(() => {
      return yup.object().shape({
        name: yup.string().required(t("field_project_name_vali_required")),
        surveyLanguage: yup
          .object({
            id: yup.string().required(t("field_survey_language_vali_required")),
          })
          .required(t("field_survey_language_vali_required")),
        category: yup.string(),
        priceTestTypeId: solutionSelected?.typeId === ESOLUTION_TYPE.PRICE_TEST 
                        ? yup.number().required(t("field_solution_type_id_required_price_test")) 
                        : yup.number().notRequired()
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language, solutionSelected?.typeId]);

    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
    } = useForm<CreateProjectFormData>({
      resolver: yupResolver(schema),
      mode: "onChange",
      defaultValues: {
        surveyLanguage: langOptions.find(option => option.id === Lang.VI)
      },
    });
    const onSubmit = (data: CreateProjectFormData) => {
      if (!solutionSelected) return;
      dispatch(setLoading(true));
      ProjectService.createProject({
        solutionId: solutionSelected.id,
        planId: planSelected.id,
        name: data.name,
        surveyLanguage: data.surveyLanguage.id,
        category: data.category || "",
        priceTestTypeId: data.priceTestTypeId
      })
        .then((res: Project) => {
          dispatch(setHowToSetupSurveyReducer(true))
          dispatch(
            push(routes.project.detail.root.replace(":id", `${res.id}`))
          );
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    };

    return (
      <Container maxWidth="sm" className={classes.bodyContent}>
        <Grid justifyContent="center">
          <Heading1
            className={classes.title}
            $colorName="--cimigo-blue"
            $fontWeight={"600"}
            translation-key={`project_create_tab_create_project_create_title`}
          >
            {t(`project_create_tab_create_project_create_title`)}
          </Heading1>
        </Grid>
        <Grid className={classes.handleLink}>
          <Grid className={classes.handleLinkFormat}>
            <ParagraphBody
              $colorName={"--eerie-black"}
              translation-key="common_solution"
            >
              {t("common_solution")}:
            </ParagraphBody>
            <Heading5 mx={0.5} $fontWeight={"600"} $colorName={"--eerie-black"}>
              {solutionSelected?.title}
            </Heading5>
            <ParagraphSmallUnderline2
              translation-key="common_change"
              className={classes.link}
              onClick={() => {
                onClickHandleBack(EStep.SELECT_SOLUTION);
              }}
            >
              ({t("common_change")})
            </ParagraphSmallUnderline2>
          </Grid>
          <Grid className={classes.handleLinkFormat}>
            <ParagraphBody $colorName={"--eerie-black"} translation-key="common_plan">
              {t("common_plan")}:
            </ParagraphBody>
            <Heading5
              mx={0.5}
              $fontWeight={"600"}
              $colorName={"--eerie-black"}
              translation-key={"common_month"}
            >{`${planSelected?.title} (${getCostCurrency(planSelected?.price || 0)?.show} 
            ${
              planSelected?.month
                ? `/ ${planSelected.month > 1 ? planSelected.month : ""} ${t("common_month", {
                      s:planSelected.month === 1 ? "" : t("common_s"),
                    })}`
                : ""
            })`}</Heading5>
            <ParagraphSmallUnderline2
              translation-key={plan?.data?.length !== 1 ? "common_change" : "common_review"}
              className={classes.link}
              onClick={() => {
                onClickHandleBack(EStep.SELECT_PLAN);
              }}
            >
              {plan?.data?.length !== 1 ? `(${t("common_change")})` : `(${t("common_review")})`}
            </ParagraphSmallUnderline2>
          </Grid>
        </Grid>
        <Grid className={classes.note} mt={2}>
          <ParagraphBody
            $colorName={"--eerie-black"}
            translation-key="project_create_tab_create_project_note_description"
            dangerouslySetInnerHTML={{
              __html: t("project_create_tab_create_project_note_description"),
            }}
          ></ParagraphBody>
        </Grid>
        <ParagraphBody
          mt={4}
          $colorName={"--eerie-black"}
          translation-key="project_create_tab_create_project_note_description2"
        >
          {t("project_create_tab_create_project_note_description2")}
        </ParagraphBody>
        <Grid className={classes.form}>
          <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <InputTextfield
                  name="name"
                  type="text"
                  titleRequired
                  placeholder={t("field_project_name_placeholder")}
                  translation-key-placeholder="field_project_name_placeholder"
                  title={t("field_project_name")}
                  translation-key="field_project_name"
                  inputRef={register("name")}
                  errorMessage={errors.name?.message}
                  inputProps={
                    {
                      "data-lpignore": "true",
                      "autoComplete": "off"
                    }
                  }
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <InputSelect
                  className={classes.selectLeaguage}
                  title={t("field_survey_language")}
                  name="surveyLanguage"
                  control={control}
                  selectProps={{
                    options: langOptions,
                    placeholder: t("field_survey_language_placeholder"),
                  }}
                  toolTipTranslation="field_survey_language_tooltip"
                  errorMessage={
                    (errors.surveyLanguage as any)?.message ||
                    errors.surveyLanguage?.id?.message
                  }
                />
              </Grid>
              {solutionSelected?.typeId === ESOLUTION_TYPE.PACK && (
                <Grid className={classes.accordion}>
                  <Accordion className={classes.accordionContent}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                    >
                      <Grid>
                        <Heading5
                          $colorName={"--cimigo-blue"}
                          translation-key="project_create_tab_create_project_infor"
                        >
                          {t("project_create_tab_create_project_infor")}
                        </Heading5>
                        <ParagraphExtraSmall
                          $colorName={"--gray-60"}
                          translation-key="common_optional_upper"
                        >
                          {t("common_optional_upper")}
                        </ParagraphExtraSmall>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={{ paddingBottom: '24px' }}>
                      <Grid>
                        <ParagraphSmall
                          $colorName={"--gray-80"}
                          translation-key="project_create_tab_create_project_description"
                          dangerouslySetInnerHTML={{
                            __html: t("project_create_tab_create_project_description"),
                          }}
                        ></ParagraphSmall>
                        <Grid container rowSpacing={2} sx={{ marginTop: "0" }}>
                          <Grid item xs={12}>
                            <InputTextfield
                              className={classes.inputAccordion}
                              name="category"
                              type="text"
                              inputProps={{ maxLength: "50" }}
                              placeholder={t("field_project_category_placeholder")}
                              translation-key-placeholder="field_project_category_placeholder"
                              inputRef={register("category")}
                              errorMessage={errors.category?.message}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              )}
              {solutionSelected?.typeId === ESOLUTION_TYPE.VIDEO_CHOICE && (
                <Grid className={classes.accordion}>
                  <Accordion className={classes.accordionContent}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                    >
                      <Grid>
                        <Heading5
                          $colorName={"--cimigo-blue"}
                          translation-key="project_create_tab_create_project_infor_video_choice"
                        >
                          {t("project_create_tab_create_project_infor_video_choice")}
                        </Heading5>
                        <ParagraphExtraSmall
                          $colorName={"--gray-60"}
                          translation-key="common_optional_upper"
                        >
                          {t("common_optional_upper")}
                        </ParagraphExtraSmall>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={{ paddingBottom: '24px' }}>
                      <Grid>
                        <ParagraphSmall
                          $colorName={"--gray-80"}
                          translation-key="project_create_tab_create_project_description_video_choice"
                          dangerouslySetInnerHTML={{
                            __html: t("project_create_tab_create_project_description_video_choice"),
                          }}
                        ></ParagraphSmall>
                        <Grid container rowSpacing={2} sx={{ marginTop: "0" }}>
                          <Grid item xs={12}>
                            <InputTextfield
                              className={classes.inputAccordion}
                              name="category"
                              type="text"
                              inputProps={{ maxLength: "50" }}
                              placeholder={t("field_video_choice_project_category_placeholder")}
                              translation-key-placeholder="field_video_choice_project_category_placeholder"
                              inputRef={register("category")}
                              errorMessage={errors.category?.message}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              )}
              {solutionSelected?.typeId === ESOLUTION_TYPE.PRICE_TEST && (
                 <Grid className={classes.contentPriceTest}>
                    <ParagraphBody
                        $colorName={"--eerie-black"}
                        translation-key="project_create_tab_create_project_description_price_test"
                      >
                      {t("project_create_tab_create_project_description_price_test")}
                    </ParagraphBody>

                    <SelectPriceTestType name="priceTestTypeId" control={control} errorMessage={errors.priceTestTypeId?.message}/>
                 </Grid>
              )}
              <Grid className={classes.buttonSubmit}>
                <Button
                  fullWidth
                  children={t("project_create_tab_create_project_btn_submit")}
                  translation-key="project_create_tab_create_project_btn_submit"
                  btnType={BtnType.Primary}
                  padding={"8px 47px"}
                  type="submit"
                />
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Container>
    );
  }
);
export default CreateProjectStep;