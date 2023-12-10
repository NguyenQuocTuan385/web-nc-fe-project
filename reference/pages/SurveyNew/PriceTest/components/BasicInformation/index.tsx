import { memo, useMemo, useState } from 'react';
import { Project, SETUP_SURVEY_SECTION } from 'models/project';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Grid } from '@mui/material';
import Heading4 from 'components/common/text/Heading4';
import classes from './styles.module.scss';
import ParagraphBody from 'components/common/text/ParagraphBody';
import { EPRICE_TEST_TYPE_ID } from 'models';
import PopupConfirmChangePriceTestType from 'pages/SurveyNew/PriceTest/components/PopupConfirmChangePriceTestType';
import { PriceTestService } from 'services/price_test';
import {
  getPriceTestRequest,
  refreshTriggerValidate,
} from 'redux/reducers/Project/actionTypes';
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from 'redux/reducers/Status/actionTypes';
import { PriceTestTypeBox } from '../PriceTestTypeBox';
import PriceSetup from '../PriceSetup';
import { RightDivider } from '..';
import PictureList from '../PictureList';
import ProductDescription from '../ProductDescription';
import ServiceDescription from '../ServiceDescription';
import { editableProject } from 'helpers/project';

interface BasicInformationProps {
  project: Project;
  step: number;
}
const BasicInformation = memo(({ step, project }: BasicInformationProps) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const currentType = useMemo(
    () => project?.priceTest?.typeId || EPRICE_TEST_TYPE_ID.PRODUCT,
    [project]
  );

  const editable = useMemo(() => editableProject(project), [project]);

  const [typeChange, setTypeChange] = useState(null);

  const onChangeType = (type: EPRICE_TEST_TYPE_ID) => {
    if (!editable) return;
    if (type !== currentType) setTypeChange(type);
  };

  const onClosePopupConfirm = () => {
    setTypeChange(null);
  };

  const handleChangeType = () => {
    dispatch(setLoading(true));
    PriceTestService.changeType(project?.priceTest?.id, {
      typeId: typeChange,
    })
      .then((res) => {
        dispatch(getPriceTestRequest(project.id));
        dispatch(setSuccessMess(res.message));
        dispatch(refreshTriggerValidate());
        onClosePopupConfirm();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };
  return (
    <Grid id={SETUP_SURVEY_SECTION.basic_information}>
      <Heading4
        $fontSizeMobile={'16px'}
        mb={2}
        $colorName="--eerie-black"
        translation-key="price_test_setup_basic_infor_title"
      >
        {t('price_test_setup_basic_infor_title', { step: step })}
      </Heading4>
      <Grid className={classes.sectionWrapper}>
        <ParagraphBody
          $colorName="--gray-80"
          mb={{ xs: 1, sm: 2 }}
          translation-key="price_test_setup_basic_infor_sub_title"
        >
          {t('price_test_setup_basic_infor_sub_title')}
        </ParagraphBody>
        <PriceTestTypeBox
          disabled={!editable}
          value={project?.priceTest?.typeId}
          onChangeType={onChangeType}
        />
        <Grid sx={{ mt: 3 }} className={classes.infoWrapper}>
          {project?.priceTest?.typeId === EPRICE_TEST_TYPE_ID.PRODUCT ? (
            <>
              <RightDivider sx={{ mb: 3 }}>
                <ParagraphBody translation-key="price_test_setup_basic_infor_product_title">
                  {t('price_test_setup_basic_infor_product_title')}
                </ParagraphBody>
              </RightDivider>
              <ProductDescription project={project} />
              <PictureList project={project} />
              <RightDivider sx={{ mb: 3, mt: 3 }}>
                <ParagraphBody translation-key="price_test_price_section_product_header">
                  {t('price_test_price_section_product_header')}
                </ParagraphBody>
              </RightDivider>
              <PriceSetup project={project} />
            </>
          ) : (
            <>
              <RightDivider sx={{ mb: 3 }}>
                <ParagraphBody translation-key="price_test_setup_basic_infor_service_title">
                  {t('price_test_setup_basic_infor_service_title')}
                </ParagraphBody>
              </RightDivider>
              <ServiceDescription project={project} />
              <PictureList project={project} />
              <RightDivider sx={{ mb: 3, mt: 3 }}>
                <ParagraphBody translation-key="price_test_price_section_service_header">
                  {t('price_test_price_section_service_header')}
                </ParagraphBody>
              </RightDivider>
              <PriceSetup project={project} />
            </>
          )}
        </Grid>
      </Grid>
      {!!typeChange && (
        <PopupConfirmChangePriceTestType
          isOpen={!!typeChange}
          onYes={handleChangeType}
          onCancel={onClosePopupConfirm}
          typeTitle={
            typeChange === EPRICE_TEST_TYPE_ID.PRODUCT
              ? t('project_create_tab_create_project_type_product_price_test')
              : t('project_create_tab_create_project_type_service_price_test')
          }
        />
      )}
    </Grid>
  );
});
export default BasicInformation;
