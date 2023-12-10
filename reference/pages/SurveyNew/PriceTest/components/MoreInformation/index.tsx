import Heading5 from 'components/common/text/Heading5';
import classes from './styles.module.scss';
import ParagraphBody from 'components/common/text/ParagraphBody';
import { Project } from 'models/project';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextareaField from '../TextareaField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import yup from 'config/yup.custom';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from 'redux/reducers/Status/actionTypes';
import { PriceTestService } from 'services/price_test';
import { EPRICE_TEST_TYPE_ID } from 'models';
import { setPriceTestReducer } from 'redux/reducers/Project/actionTypes';
import { editableProject } from 'helpers/project';

const MAX_LENGTH = 200;

const MoreInformation = memo(({ project }: { project: Project }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const editable = useMemo(() => editableProject(project), [project]);

  const [editting, setEditting] = useState(false);

  const onStartEditing = () => {
    if (!editable) return;
    setEditting(true);
    reset({
      additionInfo: project?.priceTest?.additionInfo || '',
    });
  };

  const schema = yup.object().shape({
    additionInfo: yup
      .string()
      .max(
        MAX_LENGTH,
        t('price_test_more_information_max_length_alert', { max: MAX_LENGTH })
      ),
  });

  const { control, reset, handleSubmit } = useForm<{ additionInfo: string }>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onCancel = () => {
    setEditting(false);
  };

  const onSubmit = (data: { additionInfo: string }) => {
    dispatch(setLoading(true));
    PriceTestService.update(project.priceTest.id, data)
      .then((res) => {
        dispatch(
          setPriceTestReducer({
            ...project.priceTest,
            additionInfo: data.additionInfo,
          })
        );
        dispatch(setSuccessMess(res.message));
        onCancel();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Heading5 sx={{ mb: 1 }} $fontWeight={600}>
        {project?.priceTest?.typeId === EPRICE_TEST_TYPE_ID.PRODUCT
          ? t('price_test_more_information_product')
          : t('price_test_more_information_service')}
      </Heading5>
      {!editting ? (
        <>
          {project?.priceTest?.additionInfo && (
            <Heading5 $fontWeight={400} className={classes.additionInfo}>
              {project.priceTest.additionInfo}
            </Heading5>
          )}
          {editable && (
            <ParagraphBody
              $colorName="--cimigo-blue-light-1"
              className={classes.showFieldText}
              onClick={onStartEditing}
            >
              {project?.priceTest?.additionInfo
                ? t('common_edit')
                : t('price_test_additional_information')}
            </ParagraphBody>
          )}
        </>
      ) : (
        <TextareaField
          name="additionInfo"
          control={control}
          placeholder={t('price_test_additional_information_placeholder')}
          maxLength={MAX_LENGTH}
          onCancel={onCancel}
        />
      )}
    </Box>
  );
});

export default MoreInformation;
