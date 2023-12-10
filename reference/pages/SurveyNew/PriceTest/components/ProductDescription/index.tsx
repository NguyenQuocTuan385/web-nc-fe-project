import classes from './styles.module.scss';
import Heading5 from 'components/common/text/Heading5';
import { useTranslation } from 'react-i18next';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import { Box, Button, Grid, IconButton, Stack } from '@mui/material';
import Quote from 'components/icons/IconQuote';
import clsx from 'clsx';
import DashedInputField from '../DashedInputField';
import { DesciptionSampleText } from '..';
import { memo, useEffect, useMemo, useState } from 'react';
import ParagraphBody from 'components/common/text/ParagraphBody';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from 'redux/reducers/Status/actionTypes';
import PopupExampleInformation from 'pages/SurveyNew/PriceTest/components/PopupExampleInformation';
import yup from 'config/yup.custom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Project, SETUP_SURVEY_SECTION } from 'models/project';
import { PriceTestService } from 'services/price_test';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import MoreInformation from '../MoreInformation';
import { setPriceTestReducer } from 'redux/reducers/Project/actionTypes';
import { editableProject } from 'helpers/project';

interface DescriptionForm {
  name: string;
  brand: string;
  packing: string;
}

const ProductDescription = memo(({ project }: { project: Project }) => {
  const { t } = useTranslation();

  const { triggerValidate } = useSelector(
    (state: ReducerType) => state.project
  );

  const dispatch = useDispatch();

  const editable = useMemo(() => editableProject(project), [project]);

  const [showPopupExample, setShowPopupExample] = useState(false);

  const onShowPopupExample = () => {
    setShowPopupExample(true);
  };

  const onClosePopupExample = () => {
    setShowPopupExample(false);
  };
  const schema = yup.object().shape({
    name: yup.string().required(''),
    brand: yup.string().required(''),
    packing: yup.string().required(''),
  });

  const { control, reset, trigger } = useForm<DescriptionForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (project.priceTest) {
      reset({
        name: project.priceTest.name || '',
        brand: project.priceTest.brand || '',
        packing: project.priceTest.packing || '',
      });
    }
  }, [project.priceTest]);

  useEffect(() => {
    if (triggerValidate) trigger();
  }, [triggerValidate]);

  const onSave = (data: DescriptionForm) => {
    dispatch(setLoading(true));
    PriceTestService.update(project.priceTest.id, data)
      .then((res) => {
        dispatch(
          setPriceTestReducer({
            ...project.priceTest,
            ...data,
          })
        );
        dispatch(setSuccessMess(res.message));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  return (
    <>
      <Grid sx={{ mb: 3 }} id={SETUP_SURVEY_SECTION.price_step_description}>
        <Heading5 translation-key="price_test_setup_basic_infor_product_description_title">
          {t('price_test_setup_basic_infor_product_description_title')}
        </Heading5>
        <ParagraphSmall
          sx={{ mb: 1 }}
          $colorName="--eerie-black"
          translation-key="price_test_setup_basic_infor_product_description_subtitle"
        >
          {t('price_test_setup_basic_infor_product_description_subtitle')}
        </ParagraphSmall>
        <Stack className={classes.formWrapper}>
          <Box>
            <Quote className={clsx(classes.quoteIcon, classes.flip)} />
          </Box>
          <Box className={classes.descriptionForm} sx={{ py: 2 }}>
            <Stack className={classes.introduceSection} sx={{ mb: 2 }}>
              <DesciptionSampleText translation-key="price_test_desciption_product_text_1">
                {t('price_test_desciption_product_text_1')}
              </DesciptionSampleText>
              <DashedInputField
                name="name"
                placeholder={t('price_test_placeholder_product_text_1')}
                translation-key="price_test_placeholder_product_text_1"
                control={control}
                onSave={onSave}
                disabled={!editable}
              />
              <DesciptionSampleText translation-key="price_test_desciption_product_text_2">
                {t('price_test_desciption_product_text_2')}
              </DesciptionSampleText>
              <DashedInputField
                name="brand"
                placeholder={t('price_test_placeholder_product_text_2')}
                translation-key="price_test_placeholder_product_text_2"
                control={control}
                onSave={onSave}
                disabled={!editable}
              />
              <DesciptionSampleText translation-key="price_test_desciption_product_text_3">
                {t('price_test_desciption_product_text_3')}
              </DesciptionSampleText>
              <DashedInputField
                name="packing"
                placeholder={t('price_test_placeholder_product_text_3')}
                translation-key="price_test_placeholder_product_text_3"
                control={control}
                onSave={onSave}
                disabled={!editable}
              />
            </Stack>
            <MoreInformation project={project} />
          </Box>
          <Box className={classes.endQuoteWrapper}>
            <Quote className={classes.quoteIcon} />
          </Box>
        </Stack>
        <Button
          onClick={onShowPopupExample}
          className={classes.viewExampleBtn}
          endIcon={<EmojiObjectsOutlinedIcon />}
        >
          <ParagraphSmall>
            {t('price_test_additional_information_example')}
          </ParagraphSmall>
        </Button>
      </Grid>
      <PopupExampleInformation
        open={showPopupExample}
        onClose={onClosePopupExample}
      />
    </>
  );
});

export default ProductDescription;
