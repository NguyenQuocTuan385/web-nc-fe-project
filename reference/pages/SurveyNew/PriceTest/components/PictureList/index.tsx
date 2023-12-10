import { memo, useMemo, useState } from 'react';
import classes from './styles.module.scss';
import { Project, SETUP_SURVEY_SECTION } from 'models/project';
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from 'redux/reducers/Status/actionTypes';
import { Close } from '@mui/icons-material';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import ParagraphSmallUnderline from 'components/common/text/ParagraphSmallUnderline';
import Heading5 from 'components/common/text/Heading5';
import UploadPictureBox from '../UploadPictureBox';
import ProjectHelper, { editableProject } from 'helpers/project';
import { getPriceTestRequest } from 'redux/reducers/Project/actionTypes';
import { PriceTestService } from 'services/price_test';
import { Grid, Stack, Box, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { EPRICE_TEST_TYPE_ID } from 'models';
import NoteWarning from 'components/common/warnings/NoteWarning';
import ParagraphSmallUnderline2 from 'components/common/text/ParagraphSmallUnderline2';
import PopupImageInstruction from '../PopupImageInstruction';
import clsx from 'clsx';

const PictureList = memo(({ project }: { project: Project }) => {
  const { t } = useTranslation();

  const [openPopupImageInstruction, setOpenPopupImageInstruction] =
    useState(false);

  const onClosePopupImageInstruction = () =>
    setOpenPopupImageInstruction(false);

  const onOpenPopupImageInstruction = () => setOpenPopupImageInstruction(true);

  const dispatch = useDispatch();

  const editable = useMemo(() => editableProject(project), [project]);

  const priceTestPicture = useMemo(
    () => project?.priceTest?.priceTestPictures,
    [project]
  );

  const maxPicture = useMemo(
    () => ProjectHelper.maxPriceTestPicture(project) || 0,
    [project]
  );

  const pictureNeedMore = useMemo(
    () => ProjectHelper.priceTestPictureNeedMore(project) || 0,
    [project]
  );

  const onDeleteImage = (id: number) => {
    dispatch(setLoading(true));
    PriceTestService.deletePicture(project?.priceTest?.id, id)
      .then((res) => {
        dispatch(getPriceTestRequest(project.id));
        dispatch(setSuccessMess(res.message));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  return (
    <Grid id={SETUP_SURVEY_SECTION.price_step_picture}>
      <Heading5>{t('price_test_image_section_title')}</Heading5>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 1 }}>
        <ParagraphSmall $colorName="--eerie-black">
          {project?.priceTest?.typeId === EPRICE_TEST_TYPE_ID.PRODUCT
            ? t('price_test_image_section_product_subtitle', {
                number: maxPicture,
              })
            : t('price_test_image_section_service_subtitle', {
                number: maxPicture,
              })}
        </ParagraphSmall>
        <ParagraphSmallUnderline2 onClick={onOpenPopupImageInstruction}>
          {t('price_test_image_section_view_guide')}
        </ParagraphSmallUnderline2>
      </Stack>
      {!!pictureNeedMore && (
        <NoteWarning>
          <ParagraphSmall
            translation-key="price_test_picture_need_more_warning"
            $colorName="--warning-dark"
            sx={{ '& > span': { fontWeight: 600 } }}
            dangerouslySetInnerHTML={{
              __html: t('price_test_picture_need_more_warning', {
                number: pictureNeedMore,
              }),
            }}
          />
        </NoteWarning>
      )}
      <Stack className={classes.pictureSection} sx={{ mt: 2 }}>
        {priceTestPicture?.map((picture) => (
          <Box className={classes.priceTestPicture} key={picture.id}>
            <img src={picture.url} alt="img" />
            {editable && (
              <IconButton
                className={classes.deleteImg}
                onClick={() => onDeleteImage(picture.id)}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        ))}
        {priceTestPicture?.length < maxPicture && editable && (
          <UploadPictureBox project={project} />
        )}
      </Stack>

      <PopupImageInstruction
        isOpen={openPopupImageInstruction}
        typeTitle={project?.priceTest?.typeId}
        onClose={onClosePopupImageInstruction}
      />
    </Grid>
  );
});

export default PictureList;
