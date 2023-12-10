import { Box, Grid } from '@mui/material';
import { memo, useMemo } from 'react';
import classes from './styles.module.scss';
import Images from "config/images";
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { ProjectStatus } from 'models/project';
import { Download } from '@mui/icons-material';
import { AttachmentService } from 'services/attachment';
import FileSaver from 'file-saver';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';
import { Content, LeftContent, PageRoot } from '../components';
import Button, { BtnType } from 'components/common/buttons/Button';
import TextBtnSecondary from 'components/common/text/TextBtnSecondary';
import ProjectHelper from 'helpers/project';
import Heading1 from 'components/common/text/Heading1';
import Heading4 from 'components/common/text/Heading4';
import Heading3 from 'components/common/text/Heading3';
import { useTranslation } from 'react-i18next';

interface Props {
  projectId: number,
}

const Report = memo(({ projectId }: Props) => {

  const dispatch = useDispatch()

  const { t, i18n } = useTranslation()

  const { project } = useSelector((state: ReducerType) => state.project)

  const isPaymentPaid = useMemo(() => ProjectHelper.isPaymentPaid(project), [project])

  const isReportReady = useMemo(() => ProjectHelper.isReportReady(project), [project])

  const reportReadyDate = useMemo(() => {
    return ProjectHelper.getReportReadyDate(project, i18n.language).format("DD MMMM, YYYY")
  }, [i18n.language, project])

  const onDownLoad = () => {
    dispatch(setLoading(true))
    AttachmentService.download(project.reports[0].id)
      .then(res => {
        FileSaver.saveAs(res.data, project.reports[0].fileName)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <PageRoot>
      <LeftContent>
        <Content className={classes.root}>
          {isReportReady ? (
            <Grid className={classes.content}>
              {!!project.reports?.length && (
                <Box display={"flex"} justifyContent="flex-end">
                  <Button
                    btnType={BtnType.Raised}
                    startIcon={<Download />}
                    onClick={onDownLoad}
                    children={<TextBtnSecondary translation-key="report_btn_download">{t('report_btn_download')}</TextBtnSecondary>}
                  />
                </Box>
              )}
              <Box mt={2} sx={{ minHeight: '600px' }}>
                {!!project.dataStudio && (
                  <iframe
                    width="100%"
                    height="800"
                    src={project.dataStudio}
                    allowFullScreen
                    frameBorder={0}
                    className={classes.iframe}
                    title="data-studio"
                  >
                  </iframe>
                )}
              </Box>
            </Grid>
          ) : (
            <Grid className={classes.noSetup}>
              {isPaymentPaid ? (
                <img src={Images.imgNoResultPaid} alt="" />
              ) : (
                <img src={Images.imgNoResultNotPay} alt="" />
              )}
              <Heading1 align="center" mb={2} $colorName="--gray-80" translation-key="report_coming_soon">{t('report_coming_soon')}</Heading1>
              {isPaymentPaid ? (
                <Heading4 align="center" sx={{ fontWeight: "400 !important" }} $colorName="--gray-80" translation-key="report_coming_soon_des_paid">
                  {t("report_coming_soon_des_paid")} <Heading3 align="center" variant="body2" variantMapping={{ body2: "span" }} $colorName='--cimigo-blue'>{reportReadyDate}.</Heading3>
                </Heading4>
              ) : (
                <Heading4 align="center" sx={{ fontWeight: "400 !important" }} $colorName="--gray-80" translation-key="report_coming_soon_des_not_pay">
                  {t("report_coming_soon_des_not_pay")}
                </Heading4>
              )}
            </Grid>
          )}
        </Content>
      </LeftContent>
    </PageRoot>
  )
})

export default Report;