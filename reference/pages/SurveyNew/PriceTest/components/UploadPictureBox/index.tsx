import classes from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import { Button } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AddPhotoAlternateOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from 'redux/reducers/Status/actionTypes';
import { Project } from 'models/project';
import ProjectHelper from 'helpers/project';
import { ReducerType } from 'redux/reducers';
import clsx from 'clsx';
import { getPriceTestRequest } from 'redux/reducers/Project/actionTypes';
import { PriceTestService } from 'services/price_test';

const IMAGE_SIZE = 10 * 1000000;
const IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

const UploadPictureBox = memo(({ project }: { project: Project }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { triggerValidate } = useSelector(
    (state: ReducerType) => state.project
  );

  const isValidPicture = useMemo(
    () => ProjectHelper.isValidPriceTestPicture(project),
    [project]
  );

  const [error, setError] = useState(false);

  useEffect(() => {
    if (triggerValidate && !isValidPicture) setError(true);
    else setError(false);
  }, [triggerValidate, isValidPicture]);

  const onUploadPicture = (file: File) => {
    const form = new FormData();
    form.append('picture', file);
    dispatch(setLoading(true));
    PriceTestService.createPicture(form, project.priceTest.id)
      .then((res) => {
        dispatch(getPriceTestRequest(project.id));
        dispatch(setSuccessMess(res.message));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onDropPicture = useCallback(async (acceptedFiles) => {
    let file: File = acceptedFiles[0];
    const checkSize = file.size < IMAGE_SIZE;
    const checkType = IMAGE_FORMATS.includes(file.type);
    if (!checkSize) {
      dispatch(
        setErrorMess(t('price_test_picture_size_error'))
      );
      return;
    }
    if (!checkType) {
      dispatch(
        setErrorMess(t('price_test_picture_type_error'))
      );
      return;
    }
    onUploadPicture(file);
  }, [project]);

  const { getRootProps } = useDropzone({
    onDrop: onDropPicture,
    multiple: false,
  });

  return (
    <Button
      disableRipple
      {...getRootProps()}
      className={clsx(classes.uploadBox, { [classes.error]: !!error })}
    >
      <AddPhotoAlternateOutlined />
      <ParagraphSmall $colorName="--gray-60">
        {t('price_test_image_section_add_image')}
      </ParagraphSmall>
    </Button>
  );
});

export default UploadPictureBox;
