import { memo } from "react";
import classes from "../../styles.module.scss";
import ParagraphBody from 'components/common/text/ParagraphBody';
import { useTranslation } from 'react-i18next';
import { ItemSubBox, ItemSubLeft, ItemSubRight } from "..";

interface CustomQuestionsPreviewProps {
  customQuestionLength: number;
}

const CustomQuestionsPreview = memo(({ customQuestionLength }: CustomQuestionsPreviewProps) => {
  const { t } = useTranslation();

  return (
    <>
      <ItemSubBox>
        <ItemSubLeft>
          <ParagraphBody
            $colorName="--eerie-black-00"
            translation-key="payment_billing_sub_tab_preview_custom_question"
          >
            {t("payment_billing_sub_tab_preview_custom_question")}
          </ParagraphBody>
        </ItemSubLeft>
        <ItemSubRight>
          <ParagraphBody
            $colorName="--eerie-black"
            translation-key="payment_billing_sub_tab_preview_questions"
            className={classes.numberOfItem}
            dangerouslySetInnerHTML={{
              __html: t("payment_billing_sub_tab_preview_questions", {
                number: customQuestionLength,
              }),
            }}
          />
        </ItemSubRight>
      </ItemSubBox>
    </>
  )
});

export default CustomQuestionsPreview;