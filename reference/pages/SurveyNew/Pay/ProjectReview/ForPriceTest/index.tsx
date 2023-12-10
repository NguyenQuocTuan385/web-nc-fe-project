import { useCallback, useMemo } from "react";
import classes from "../styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { ReducerType } from "redux/reducers";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import ProjectHelper from "helpers/project";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading5 from "components/common/text/Heading5";
import { KeyboardArrowRight } from "@mui/icons-material";
import { SETUP_SURVEY_SECTION } from "models/project";
import { EPRICE_TEST_TYPE_ID } from "models";
import { ECurrency } from "models/general";
import { fCurrency, fCurrencyVND } from "utils/formatNumber";
import { EPaymentPeriodType, paymentPeriodTypes } from "models/price_test";
import ImagesGallery from "../components/ImagesGallery";
import CustomQuestionsPreview from "../components/CustomQuestionsPreview";
import {
  ButtonGoTo,
  ItemContent,
  ItemHead,
  ItemSubBox,
  ItemSubLeft,
  ItemSubRightCustom,
  RowItemBox,
} from "../components";


interface IPriceTestDescription {
  titleContent: string;
  content: string;
  onGotoSection: () => void;
}

interface IPriceTestPriceConverter {
  estimatePrice: string;
  stepPrice: string;
}

const ForPriceTest = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { project } = useSelector((state: ReducerType) => state.project);

  const priceTest = useMemo(() => project?.priceTest, [project?.priceTest]);

  const isValidCategory = useMemo(() => {
    return !!priceTest?.brand;
  }, [priceTest]);

  const isValidPacking = useMemo(() => {
    return !!priceTest?.packing;
  }, [priceTest]);

  const isValidName = useMemo(() => {
    return !!priceTest?.name;
  }, [priceTest]);

  const isValidProvider = useMemo(() => {
    return !!priceTest?.provider;
  }, [priceTest]);

  const isValidPriceTestPicture = useMemo(() => {
    return ProjectHelper.isValidPriceTestPicture(project);
  }, [project]);

  const isValidPriceTestPriceSetup = useMemo(() => {
    return ProjectHelper.isValidPriceTestPriceSetup(project);
  }, [project]);

  const priceTestPictureNeedMore = useMemo(() => {
    return ProjectHelper.priceTestPictureNeedMore(project);
  }, [project]);

  const priceTestPictures = useMemo(() => {
    return priceTest?.priceTestPictures;
  }, [priceTest]);

  const convertPrice = useCallback(
    (price: number) => {
      if (!price) return undefined;
      if (priceTest?.currency === ECurrency.USD) return fCurrency(price);
      return fCurrencyVND(price);
    },
    [priceTest?.currency]
  );

  const priceTestPriceConverter: IPriceTestPriceConverter = useMemo(() => {
    return {
      estimatePrice: convertPrice(priceTest?.estimatePrice),
      stepPrice: convertPrice(priceTest?.stepPrice),
    };
  }, [priceTest, convertPrice]);  

  const paymentPeriodTitle = useMemo(() => {
    if (!priceTest?.paymentPeriod) return undefined;
    if (priceTest?.paymentPeriod === EPaymentPeriodType.OTHER)
      return priceTest?.customPaymentPeriod;
    return t(paymentPeriodTypes.find(
      (item) => item.id === priceTest?.paymentPeriod
    )?.name);
  }, [priceTest?.paymentPeriod, priceTest?.customPaymentPeriod]);

  const gotoSetupSurvey = () => {
    dispatch(push(routes.project.detail.setupSurvey.replace(":id", `${project.id}`)));
  };

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };

  const onGotoDescription = () => {
    dispatch(setScrollToSectionReducer(`${SETUP_SURVEY_SECTION.price_step_description}`));
    onRedirect(routes.project.detail.setupSurvey);
  };

  const onGotoCategory = () => {
    if (!isValidCategory) onGotoDescription();
  };

  const onGotoPacking = () => {
    if (!isValidPacking) onGotoDescription();
  };

  const onGotoName = () => {
    if (!isValidName) onGotoDescription();
  };

  const onGotoProvider = () => {
    if (!isValidProvider) onGotoDescription();
  };

  const onGotoStepPicture = () => {
    if (!isValidPriceTestPicture) {
      dispatch(setScrollToSectionReducer(`${SETUP_SURVEY_SECTION.price_step_picture}`));
      onRedirect(routes.project.detail.setupSurvey);
    }
  };

  const onGotoStepPrice = () => {
    if (!isValidPriceTestPriceSetup) {
      dispatch(setScrollToSectionReducer(`${SETUP_SURVEY_SECTION.price_step_price_setup}`));
      onRedirect(routes.project.detail.setupSurvey);
    }
  };
  
  const priceTestDescription: IPriceTestDescription[] = useMemo(() => {
    return priceTest?.typeId === EPRICE_TEST_TYPE_ID.PRODUCT 
      ? [
        {
          titleContent: "payment_billing_sub_tab_preview_category",
          content: priceTest?.brand,
          onGotoSection: onGotoCategory,
        },
        {
          titleContent: "payment_billing_sub_tab_preview_product_name",
          content: priceTest?.name,
          onGotoSection: onGotoName,
        },
        {
          titleContent: "payment_billing_sub_tab_preview_packing",
          content: priceTest?.packing,
          onGotoSection: onGotoPacking,
        },
      ]
      : [
        {
          titleContent: "payment_billing_sub_tab_preview_category",
          content: priceTest?.brand,
          onGotoSection: onGotoCategory,
        },
        {
          titleContent: "payment_billing_sub_tab_preview_service_name",
          content: priceTest?.name,
          onGotoSection: onGotoName,
        },
        {
          titleContent: "payment_billing_sub_tab_preview_provider",
          content: priceTest?.provider,
          onGotoSection: onGotoProvider,
        },
        {
          titleContent: "payment_billing_sub_tab_preview_package_name",
          content: priceTest?.packing,
          onGotoSection: onGotoPacking,
        },
      ];
   }, [priceTest]);

  return (
    <RowItemBox>
      <ItemHead>
        <Heading5
          $colorName="--eerie-black"
          translation-key="payment_billing_sub_tab_preview_survey_detail"
        >
          {t("payment_billing_sub_tab_preview_survey_detail")}
        </Heading5>
        <ButtonGoTo
          endIcon={<KeyboardArrowRight />}
          translation-key="payment_billing_sub_tab_preview_edit_setup"
          onClick={gotoSetupSurvey}
        >
          {t("payment_billing_sub_tab_preview_edit_setup")}
        </ButtonGoTo>
      </ItemHead>
      <ItemContent>
        {priceTestDescription.map((item, index) => (
          <ItemSubBox key={index}>
            <ItemSubLeft>
              <ParagraphBody
                $colorName="--eerie-black-00"
                translation-key={item.titleContent}
              >
                {t(item.titleContent)}
              </ParagraphBody>
            </ItemSubLeft>
            <ItemSubRightCustom>
              <ParagraphBody $colorName="--eerie-black">
                {item.content ?? (
                  <span
                    onClick={item.onGotoSection}
                    className={clsx(classes.colorDanger, classes.pointer)}
                    translation-key="payment_billing_sub_tab_preview_undefined"
                  >
                    {t("payment_billing_sub_tab_preview_undefined")}
                  </span>
                )}
              </ParagraphBody>
            </ItemSubRightCustom>
          </ItemSubBox>
        ))}
        {priceTest?.typeId === EPRICE_TEST_TYPE_ID.SERVICE && (
          <ItemSubBox>
            <ItemSubLeft>
              <ParagraphBody
                $colorName="--eerie-black-00"
                translation-key="payment_billing_sub_tab_preview_terms_of_payment"
              >
                {t("payment_billing_sub_tab_preview_terms_of_payment")}
              </ParagraphBody>
            </ItemSubLeft>
            <ItemSubRightCustom>
              <ParagraphBody $colorName="--eerie-black">
                {paymentPeriodTitle ?? (
                  <span
                    onClick={() => onGotoStepPrice()}
                    className={clsx(classes.colorDanger, classes.pointer)}
                    translation-key="payment_billing_sub_tab_preview_undefined"
                  >
                    {t("payment_billing_sub_tab_preview_undefined")}
                  </span>
                )}
              </ParagraphBody>
            </ItemSubRightCustom>
          </ItemSubBox>
        )}
        <ItemSubBox>
          <ItemSubLeft>
            <ParagraphBody
              $colorName="--eerie-black-00"
              translation-key="payment_billing_sub_tab_preview_image"
            >
              {t("payment_billing_sub_tab_preview_image")}
            </ParagraphBody>
          </ItemSubLeft>
          <ItemSubRightCustom>
            {priceTestPictures?.length ? (
              <>
                <ImagesGallery imagesUrl={priceTestPictures}/>
                
                {!isValidPriceTestPicture && (
                  <ParagraphBody
                    className={clsx(classes.colorDanger, classes.pointer)}
                    translation-key="payment_billing_sub_tab_preview_more_pictures"
                    onClick={onGotoStepPicture}
                  >
                    {t("payment_billing_sub_tab_preview_more_pictures", {
                      number: priceTestPictureNeedMore,
                    })}
                  </ParagraphBody>
                )}
              </>
            ) : (
              <ParagraphBody
                onClick={onGotoStepPicture}
                className={clsx(classes.colorDanger, classes.pointer)}
                translation-key="payment_billing_sub_tab_preview_undefined"
              >
                {t("payment_billing_sub_tab_preview_undefined")}
              </ParagraphBody>
            )}
          </ItemSubRightCustom>
        </ItemSubBox>
        <ItemSubBox>
          <ItemSubLeft>
            <ParagraphBody
              $colorName="--eerie-black-00"
              translation-key="payment_billing_sub_tab_preview_estimate_price"
            >
              {t("payment_billing_sub_tab_preview_estimate_price")}
            </ParagraphBody>
          </ItemSubLeft>
          <ItemSubRightCustom>
            <ParagraphBody $colorName="--eerie-black">
              {priceTestPriceConverter?.estimatePrice ?? (
                <span
                  onClick={onGotoStepPrice}
                  className={clsx(classes.colorDanger, classes.pointer)}
                  translation-key="payment_billing_sub_tab_preview_undefined"
                >
                  {t("payment_billing_sub_tab_preview_undefined")}
                </span>
              )}
            </ParagraphBody>
          </ItemSubRightCustom>
        </ItemSubBox>
        <ItemSubBox>
          <ItemSubLeft>
            <ParagraphBody
              $colorName="--eerie-black-00"
              translation-key="payment_billing_sub_tab_preview_price_step"
            >
              {t("payment_billing_sub_tab_preview_price_step")}
            </ParagraphBody>
          </ItemSubLeft>
          <ItemSubRightCustom>
            <ParagraphBody $colorName="--eerie-black">
              {priceTestPriceConverter?.stepPrice ?? (
                <span
                  onClick={onGotoStepPrice}
                  className={clsx(classes.colorDanger, classes.pointer)}
                  translation-key="payment_billing_sub_tab_preview_undefined"
                >
                  {t("payment_billing_sub_tab_preview_undefined")}
                </span>
              )}
            </ParagraphBody>
          </ItemSubRightCustom>
        </ItemSubBox>
        {!!project?.customQuestions?.length && (
          <CustomQuestionsPreview customQuestionLength={project?.customQuestions?.length} />
        )}
      </ItemContent>
    </RowItemBox>
  );
};

export default ForPriceTest;