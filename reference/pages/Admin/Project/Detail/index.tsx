import { memo, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { Project } from "models/project"
import { AdminProjectService } from "services/admin/project"
import { Box, Button, Card, CardContent, Divider, Grid, Paper, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tooltip, Typography } from "@mui/material"
import { ArrowBackOutlined, EditOutlined } from "@mui/icons-material"
import classes from './styles.module.scss'
import { fCurrency, fCurrencyVND } from "utils/formatNumber"
import { usePrice } from "helpers/price"
import { TargetQuestionType } from "models/Admin/target"
import LabelStatus from "components/LableStatus"
import { EPaymentMethod, langSupports, paymentMethods } from "models/general"
import TabPanel from "components/TabPanel"
import { getPayment } from "pages/SurveyNew/Pay/models"
import { ReducerType } from "redux/reducers"
import { Quota, QuotaTableRow } from "models/quota"
import React from "react"
import { useTranslation } from "react-i18next"
import PaymentStatus from "components/PaymentStatus"
import ProjectHelper from "helpers/project"
import { ESOLUTION_TYPE } from "models"
import DetailSurveySetupForPack from "../components/DetailSurveySetupForPack"
import DetailSurveySetupForVideoChoice from "../components/DetailSurveySetupForVideoChoice"
import DetailSurveySetupForBrandTrack from "../components/DetailSurveySetupForBrandTrack"
import PaymentScheduleDetailForBrandTrack from "../components/PaymentScheduleDetailForBrandTrack"
import ResultTab from "../components/ResultTab";
import ProjectCancelType from "components/ProjectCancelType"
import moment from 'moment';
import ProjectUsersTab from "../components/ProjectUsersTab"
import DetailSurveySetupForPriceTest from "../components/DetailSurveySetupForPriceTest"

enum ETab {
  SETUP_SURVEY,
  TARGET,
  QUOTAS,
  PAYMENT,
  USERS,
  RESULT,
}

interface Props {

}

// eslint-disable-next-line
const Detail = memo(({ }: Props) => {

  const dispatch = useDispatch()

  const { t, i18n } = useTranslation()

  const { id } = useParams<{ id: string }>();

  const { configs } = useSelector((state: ReducerType) => state.user)
  const [project, setProject] = useState<Project>(null);
  const [quotas, setQuotas] = useState<Quota[]>(null);
  const [activeTab, setActiveTab] = useState<ETab>(ETab.SETUP_SURVEY);

  const handleBack = () => {
    dispatch(push(routes.admin.project.root))
  }

  const reloadProjectInfo = async () => {
    dispatch(setLoading(true))
    AdminProjectService.getProject(Number(id))
      .then((res) => setProject({
        ...project,
        ...res,
      }))
      .catch((e) => {
        dispatch(setErrorMess(e))
        dispatch(setLoading(false))
      })
  }

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const getProject = async () => {
        dispatch(setLoading(true))
        AdminProjectService.getProject(Number(id))
          .then(res => {
            switch (res.solution?.typeId) {
              case ESOLUTION_TYPE.PACK:
                Promise.all([
                  AdminProjectService.getQuotas(Number(id)),
                  AdminProjectService.getPacks(Number(id)),
                  AdminProjectService.eyeTrackingPacks(Number(id)),
                  AdminProjectService.additionalBrands(Number(id)),
                  AdminProjectService.projectAttributes(Number(id)),
                  AdminProjectService.userAttributes(Number(id)),
                  AdminProjectService.getCustomQuestions(Number(id)),
                  AdminProjectService.getTargets(Number(id)),
                ])
                  .then(([quotas, packs, eyeTrackingPacks, additionalBrands, projectAttributes, userAttributes, customQuestions, targets]) => {
                    setProject({
                      ...res,
                      packs,
                      eyeTrackingPacks,
                      additionalBrands,
                      projectAttributes,
                      userAttributes,
                      customQuestions,
                      targets
                    })
                    setQuotas(quotas)
                  })
                  .catch((e) => dispatch(setErrorMess(e)))
                  .finally(() => dispatch(setLoading(false)))
                break;
              case ESOLUTION_TYPE.VIDEO_CHOICE:
                Promise.all([
                  AdminProjectService.getQuotas(Number(id)),
                  AdminProjectService.getVideos(Number(id)),
                  AdminProjectService.getCustomQuestions(Number(id)),
                  AdminProjectService.getTargets(Number(id)),
                ])
                  .then(([quotas, videos, customQuestions, targets]) => {
                    setProject({
                      ...res,
                      videos,
                      customQuestions,
                      targets
                    })
                    setQuotas(quotas)
                  })
                  .catch((e) => dispatch(setErrorMess(e)))
                  .finally(() => dispatch(setLoading(false)))
                break;
              case ESOLUTION_TYPE.BRAND_TRACKING:
                Promise.all([
                  AdminProjectService.getQuotas(Number(id)),
                  AdminProjectService.additionalBrands(Number(id)),
                  AdminProjectService.getCompetitiveBrands(Number(id)),
                  AdminProjectService.projectAttributes(Number(id)),
                  AdminProjectService.userAttributes(Number(id)),
                  AdminProjectService.getBrandAsset(Number(id)),
                  AdminProjectService.getCustomQuestions(Number(id)),
                  AdminProjectService.getTargets(Number(id)),
                ])
                  .then(([quotas, additionalBrands, projectBrands, projectAttributes, userAttributes, brandAssets, customQuestions, targets]) => {
                    setProject({
                      ...res,
                      additionalBrands,
                      projectBrands,
                      projectAttributes,
                      userAttributes,
                      brandAssets,
                      customQuestions,
                      targets
                    })
                    setQuotas(quotas)
                  })
                  .catch((e) => dispatch(setErrorMess(e)))
                  .finally(() => dispatch(setLoading(false)))
                break;
              case ESOLUTION_TYPE.PRICE_TEST:
                Promise.all([
                  AdminProjectService.getPriceTest(Number(id)),
                  AdminProjectService.getCustomQuestions(Number(id)),
                  AdminProjectService.getQuotas(Number(id)),
                  AdminProjectService.getTargets(Number(id)),
                ])
                  .then(([priceTest, customQuestions, quotas, targets])=>{
                    setProject({
                      ...res,
                      priceTest,
                      customQuestions,
                      targets
                    })
                    setQuotas(quotas)
                  })
                  .catch((e) => dispatch(setErrorMess(e)))
                  .finally(() => dispatch(setLoading(false)))
                break;
            }
          })
          .catch((e) => {
            dispatch(setErrorMess(e))
            dispatch(setLoading(false))
          })
      }
      getProject()
    }
  }, [id, dispatch])

  const { price } = usePrice(project)

  const getTargets = (typeIds: number[]) => {
    return project?.targets?.filter(it => typeIds.includes(it.targetQuestion?.typeId))
  }

  const payment = useMemo(() => getPayment(project?.payments), [project])

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const checkHasGroupCell = (quota: Quota, questionId: number) => {
    const question = quota.questions.find(it => it.id === questionId)
    return !!question.targetAnswers.find(it => it.targetAnswerGroup)
  }

  const getTotalSampleSize = (rows: QuotaTableRow[]) => {
    return Math.round(rows.reduce((res, item) => res + (item.sampleSize || 0), 0))
  }

  const onRedirectEdit = () => {
    if (!project) return
    dispatch(push(routes.admin.project.edit.replace(':id', `${project.id}`)));
  }

  const isPaymentPaid = useMemo(() => ProjectHelper.isPaymentPaid(project), [project])

  const reportReadyDate = useMemo(() => {
    return ProjectHelper.getReportReadyDate(project, i18n.language).format("DD MMMM, YYYY")
  }, [i18n.language, project])

  const cancelPaymentScheduleDate = useMemo(() => {
    return project?.cancelDate && moment(project.cancelDate).format("DD MMMM, YYYY")
  }, [i18n.language, project])

  const startPaymentScheduleDate = useMemo(() => {
    return project?.startPaymentSchedule && moment(project.startPaymentSchedule).format("MMMM YYYY")
  }, [i18n.language, project])

  const renderSurveySetup = () => {
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
        return <DetailSurveySetupForPack project={project} />
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        return <DetailSurveySetupForVideoChoice project={project} />
      case ESOLUTION_TYPE.BRAND_TRACKING:
        return <DetailSurveySetupForBrandTrack project={project} />
      case ESOLUTION_TYPE.PRICE_TEST:
        return <DetailSurveySetupForPriceTest project={project} />
    }
  }

  const checkSolutionType = useMemo(() => ProjectHelper.checkSolutionType(project, [ESOLUTION_TYPE.BRAND_TRACKING], false), [project])

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          Project
        </Typography>
        <Box display="flex" alignContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            startIcon={<ArrowBackOutlined />}
          >
            Back
          </Button>
          {project && checkSolutionType && (
            <Button
              sx={{ marginLeft: 2 }}
              variant="contained"
              color="primary"
              onClick={onRedirectEdit}
              startIcon={<EditOutlined />}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card elevation={3} >
            <CardContent sx={{ minHeight: '800px' }}>
              <Box display={"flex"} justifyContent="space-between">
                <Box>
                  <div className={classes.title}>Name: {project?.name}</div>
                  <Typography mt={2} ml={4} variant="h6" sx={{ fontWeight: 500 }}>ID: <span className={classes.valueBox}>{project?.id}</span></Typography>
                  {isPaymentPaid && checkSolutionType && (
                    <Typography ml={4} variant="h6" sx={{ fontWeight: 500 }}>Report ready date: <span className={classes.valueBox}>{reportReadyDate}</span></Typography>
                  )}
                  {project && project?.solution?.typeId === ESOLUTION_TYPE.BRAND_TRACKING && startPaymentScheduleDate && <Typography ml={4} variant="h6" sx={{ fontWeight: 500 }}>Project schedule start date: <span className={classes.valueBox}>{startPaymentScheduleDate}</span></Typography>}
                  {project && project?.solution?.typeId === ESOLUTION_TYPE.BRAND_TRACKING && cancelPaymentScheduleDate && <Typography ml={4} variant="h6" sx={{ fontWeight: 500 }}>Project schedule cancel time: <span className={classes.valueBox}>{cancelPaymentScheduleDate}</span></Typography>}
                  <Typography mb={4} ml={4} variant="h6" sx={{ fontWeight: 500 }}>Survey language: <span className={classes.valueBox}>{langSupports.find(it => it.key === project?.surveyLanguage)?.name}</span></Typography>
                </Box>
                {
                  project && 
                  <Box sx={{ display: 'flex' }}>
                      <LabelStatus typeStatus={project.status} solutionTypeId={project.solution.typeId} />
                      {project?.solution?.typeId === ESOLUTION_TYPE.BRAND_TRACKING && <ProjectCancelType type={project.cancelPaymentScheduleType} className={classes.cancelScheduleChip} />}
                  </Box>
                }
              </Box>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleChange}>
                  <Tab label={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Setup Survey</Typography>} />
                  <Tab label={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Target</Typography>} />
                  <Tab label={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Quotas</Typography>} />
                  <Tab label={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Payment</Typography>} />
                  <Tab label={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Users</Typography>} />
                  {
                    project?.solution?.typeId === ESOLUTION_TYPE.BRAND_TRACKING && <Tab label={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Result</Typography>} />
                  }
                </Tabs>
              </Box>
              <TabPanel value={activeTab} index={ETab.SETUP_SURVEY}>
                {renderSurveySetup()}
              </TabPanel>
              <TabPanel value={activeTab} index={ETab.TARGET}>
                <Box>
                  {
                    (project?.solution?.typeId === ESOLUTION_TYPE.BRAND_TRACKING && !!project?.sampleSize) && (
                      <Grid container mb={2}>
                        <Grid item xs={12}>
                          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" mb={1}>
                              Monthly sample size: {project?.sampleSize}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    )
                  }
                  {!!project?.targets?.length && (
                    <>
                      <Grid container spacing={2}>
                        {!!getTargets([TargetQuestionType.Location])?.length && (
                          <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                              <Typography variant="h6" mb={1}>
                                Location
                              </Typography>
                              {getTargets([TargetQuestionType.Location])?.map(it => (
                                <Typography key={it.id} variant="subtitle1" ml={2}>
                                  <strong>{it.targetQuestion?.name}: </strong>
                                  <br></br>
                                  {it.answers?.map(it =>
                                    <React.Fragment key={it.id}>
                                      <span>{it.name}</span>
                                      <br></br>
                                    </React.Fragment>)}
                                </Typography>
                              ))}
                            </Paper>
                          </Grid>
                        )}
                        {!!getTargets([TargetQuestionType.Household_Income])?.length && (
                          <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                              <Typography variant="h6" mb={1}>
                                Household income
                              </Typography>
                              {getTargets([TargetQuestionType.Household_Income])?.map(it => (
                                <Typography key={it.id} variant="subtitle1" ml={2}>
                                  <strong>{it.targetQuestion?.name}: </strong>
                                  <br></br>
                                  {it.answers?.map(it =>
                                    <React.Fragment key={it.id}>
                                      <span>{it.name}</span>
                                      <br></br>
                                    </React.Fragment>)}
                                </Typography>
                              ))}
                            </Paper>
                          </Grid>
                        )}
                        {!!getTargets([TargetQuestionType.Gender_And_Age_Quotas, TargetQuestionType.Mums_Only])?.length && (
                          <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                              <Typography variant="h6" mb={1}>
                                Age coverage
                              </Typography>
                              {getTargets([TargetQuestionType.Gender_And_Age_Quotas, TargetQuestionType.Mums_Only])?.map(it => (
                                <Typography key={it.id} variant="subtitle1" ml={2}>
                                  <strong>{it.targetQuestion?.name}: </strong>
                                  <br></br>
                                  {it.answers?.map(it =>
                                    <React.Fragment key={it.id}>
                                      <span>{it.name}</span>
                                      <br></br>
                                    </React.Fragment>)}
                                </Typography>
                              ))}
                            </Paper>
                          </Grid>
                        )}
                      </Grid>
                    </>
                  )}
                </Box>
              </TabPanel>
              <TabPanel value={activeTab} index={ETab.QUOTAS}>
                <Grid container spacing={4}>
                  {quotas?.map(quota => {
                    return (
                      <Grid key={quota.quotaTable.id} item xs={12}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                          <Typography variant="h6" mb={1}>
                            {quota.quotaTable.title}
                          </Typography>
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                {quota.questions.map(item => (
                                  <React.Fragment key={item.id}>
                                    {checkHasGroupCell(quota, item.id) && <TableCell>{item.answerGroupName || ''}</TableCell>}
                                    <TableCell>{item.name}</TableCell>
                                  </React.Fragment>
                                ))}
                                {(quota.edited) ? (
                                  <TableCell align="center" translation-key="quotas_your_adjusted_sample_size">
                                    {t('quotas_your_adjusted_sample_size')}
                                  </TableCell>
                                ) : (
                                  <TableCell align="center" translation-key="quotas_representative_sample_size">
                                    {t('quotas_representative_sample_size')}
                                  </TableCell>
                                )}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {quota.rows.map((row, index) => (
                                <TableRow key={index}>
                                  {row.targetAnswers.map(answer => (
                                    <React.Fragment key={answer.id}>
                                      {checkHasGroupCell(quota, answer.questionId) && <TableCell>{answer.targetAnswerGroup?.name || ''}</TableCell>}
                                      <TableCell>
                                        <Tooltip title={answer.description}>
                                          <div>{answer.name}</div>
                                        </Tooltip>
                                      </TableCell>
                                    </React.Fragment>
                                  ))}
                                  <TableCell align="center">
                                    {row.sampleSize || 0}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow sx={{ backgroundColor: '#e8f1fb' }}>
                                {quota.questions.map((item, index) => (
                                  <React.Fragment key={item.id}>
                                    {checkHasGroupCell(quota, item.id) && <TableCell></TableCell>}
                                    {index !== (quota.questions.length - 1) ? (
                                      <TableCell></TableCell>
                                    ) : (
                                      <TableCell align="right" translation-key="common_total">
                                        {t('common_total')}
                                      </TableCell>
                                    )}
                                  </React.Fragment>
                                ))}
                                <TableCell align="center">{getTotalSampleSize(quota.rows)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Paper>
                      </Grid>
                    )
                  })}
                </Grid>
              </TabPanel>
              <TabPanel value={activeTab} index={ETab.PAYMENT}>
                {
                  project?.solution?.typeId === ESOLUTION_TYPE.BRAND_TRACKING
                    ?
                    (
                      <PaymentScheduleDetailForBrandTrack project={project} reloadProjectInfo={reloadProjectInfo} />
                    )
                    :
                    (
                      <Box>
                        {!!payment ? (
                          <>
                            <Box mb={6}>
                              <p className={classes.textGreen}>Total amount: {fCurrency(payment?.totalAmountUSD || 0)}</p>
                              <p className={classes.textBlue}>(Equivalent to {fCurrencyVND(payment?.totalAmount || 0)})</p>
                            </Box>
                            <Box maxWidth="600px" margin="auto">
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                    <span>Sample size ({payment?.sampleSize || 0}):</span> <strong>{fCurrency(payment?.sampleSizeCostUSD || 0)}</strong>
                                  </Typography>
                                </Grid>
                                {!!payment?.customQuestions?.length && (
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                      <span>Custom questions ({payment?.customQuestions?.length}):</span> <strong>{fCurrency(payment?.customQuestionCostUSD || 0)}</strong>
                                    </Typography>
                                  </Grid>
                                )}
                                {!!payment?.eyeTrackingSampleSize && (
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                      {project?.solution?.typeId === ESOLUTION_TYPE.PACK && (
                                        <>
                                          <span>Eye-tracking ({payment?.eyeTrackingSampleSize || 0}):</span> <strong>{fCurrency(payment?.eyeTrackingSampleSizeCostUSD || 0)}</strong>
                                        </>
                                      )}
                                      {project?.solution?.typeId === ESOLUTION_TYPE.VIDEO_CHOICE && (
                                        <>
                                          <span>Emotion measurement ({payment?.eyeTrackingSampleSize || 0}):</span> <strong>{fCurrency(payment?.eyeTrackingSampleSizeCostUSD || 0)}</strong>
                                        </>
                                      )}
                                    </Typography>
                                  </Grid>
                                )}
                                <Grid item xs={12}><Divider /></Grid>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                    <span>Subtotal:</span> <strong>{fCurrency(payment?.amountUSD || 0)}</strong>
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                    <span>Tax (VAT {(payment?.vatRate || 0) * 100}%):</span> <strong>{fCurrency(payment?.vatUSD || 0)}</strong>
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}><Divider /></Grid>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                    <span>Payment reference:</span> <strong>{payment?.orderId}</strong>
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                    <span>Payment method:</span> <strong>{paymentMethods.find(it => it.id === payment?.paymentMethodId)?.name}</strong>
                                  </Typography>
                                </Grid>
                                {payment?.paymentMethodId === EPaymentMethod.BANK_TRANSFER && (
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                      <span>Confirm payment:</span> <strong>{payment?.userConfirm ? "Yes" : 'No'}</strong>
                                    </Typography>
                                  </Grid>
                                )}
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                    <span>Payment status:</span> <Box ml={0.5}><PaymentStatus status={payment?.status} /></Box>
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          </>
                        ) : (
                          <>
                            <Box mb={6}>
                              <p className={classes.textGreen}>Total amount: {fCurrency(price?.totalAmountCost?.USD || 0)}</p>
                              <p className={classes.textBlue}>(Equivalent to {fCurrencyVND(price?.totalAmountCost?.VND || 0)})</p>
                            </Box>
                            <Box maxWidth="600px" margin="auto">
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                    <span>Sample size ({project?.sampleSize || 0}):</span> <strong>{fCurrency(price?.sampleSizeCost?.USD || 0)}</strong>
                                  </Typography>
                                </Grid>
                                {!!project?.customQuestions?.length && (
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                      <span>Custom questions ({project?.customQuestions?.length}):</span> <strong>{fCurrency(price?.customQuestionCost?.USD || 0)}</strong>
                                    </Typography>
                                  </Grid>
                                )}
                                {!!project?.eyeTrackingSampleSize && (
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                      {project?.solution?.typeId === ESOLUTION_TYPE.PACK && (
                                        <>
                                          <span>Eye-tracking ({project?.eyeTrackingSampleSize || 0}):</span> <strong>{fCurrency(price?.eyeTrackingSampleSizeCost?.USD || 0)}</strong>
                                        </>
                                      )}
                                      {project?.solution?.typeId === ESOLUTION_TYPE.VIDEO_CHOICE && (
                                        <>
                                          <span>Emotion measurement ({project?.eyeTrackingSampleSize || 0}):</span> <strong>{fCurrency(price?.eyeTrackingSampleSizeCost?.USD || 0)}</strong>
                                        </>
                                      )}
                                    </Typography>
                                  </Grid>
                                )}
                                <Grid item xs={12}><Divider /></Grid>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                    <span>Subtotal:</span> <strong>{fCurrency(price?.amountCost?.USD || 0)}</strong>
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1" display="flex" justifyContent="space-between" alignItems="center">
                                    <span>Tax (VAT {(configs?.vat || 0) * 100}%):</span> <strong>{fCurrency(price?.vatCost?.USD || 0)}</strong>
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          </>
                        )}
                      </Box>
                    )
                }
              </TabPanel>
              <TabPanel value={activeTab} index={ETab.USERS}>
                  <ProjectUsersTab project={project} reloadProjectInfo={reloadProjectInfo}/>
              </TabPanel>
              {
                project?.solution?.typeId === ESOLUTION_TYPE.BRAND_TRACKING && (
                  <TabPanel value={activeTab} index={ETab.RESULT}>
                      <ResultTab project={project}/>
                  </TabPanel>
                )
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
})

export default Detail