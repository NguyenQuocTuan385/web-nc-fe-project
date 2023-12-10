import classes from './styles.module.scss';
import { Grid } from "@mui/material";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { useTranslation } from 'react-i18next';
import { setLoading, setSuccessMess, setErrorMess } from 'redux/reducers/Status/actionTypes';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import BasicLayout from "layout/BasicLayout";
import HeadLineSmall from 'components/common/headline/Small';
import QueryString from 'query-string';
import ParagraphSmallUnderline from 'components/common/text/ParagraphSmallUnderline';
import UserService from 'services/user';
import { routes } from 'routers/routes';
import yup from 'config/yup.custom';
import { push } from 'connected-react-router';
import { useEffect } from 'react';

interface IQueryString {
  email?: string;
}

const VerifyEmail = () => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { email }: IQueryString = QueryString.parse(window.location.search);

  const onSendVerify = () => {
    dispatch(setLoading(true))
    UserService.sendVerifyEmail(email)
      .then(() => {
        dispatch(setSuccessMess(t('auth_verify_email_send_success')))
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {

    const isValidQuery = yup.string().email().required().isValidSync(email);

    if (!isValidQuery) {
      dispatch(push(routes.login));
    }
  }, [email]);


  return (

    <BasicLayout className={classes.root}>
      <Helmet>
        <title>RapidSurvey - Verify Email</title>
      </Helmet>
      <Grid className={classes.body}>
        <Grid className={classes.panel} >

          <Grid >
            <HeadLineSmall translation-key="register_title_verify">{t('register_title_verify')}</HeadLineSmall>
          </Grid>
          <Grid sx={{ marginTop: '8px' }} container spacing={2}>
            <Grid item>
              <ParagraphSmall $colorName="--gray-80" translation-key="register_sub_title_verify_1"
                dangerouslySetInnerHTML={{
                  __html: t('register_sub_title_verify_1', { email: email })
                }}
              />
            </Grid>
            <Grid item >
              <ParagraphSmall $colorName="--gray-80" translation-key="register_sub_title_verify_2">{t('register_sub_title_verify_2')}
                <a className={classes.link} onClick={() => onSendVerify()} translation-key="register_success_popup_resend_email">{t('register_success_popup_resend_email')}</a>
              </ParagraphSmall>
            </Grid>
          </Grid>

          <Grid className={classes.divider} sx={{ marginTop: '24px', marginBottom: "16px" }} />

          <div className={classes.text}>
            <ParagraphExtraSmall $colorName="--gray-80" translation-key="register_already_verify">{t('register_already_verify')}
              <ParagraphSmallUnderline className={classes.link} to={routes.login} translation-key="login_title">{t('login_title')}</ParagraphSmallUnderline>
            </ParagraphExtraSmall>
          </div>
        </Grid>
      </Grid>
    </BasicLayout>

  )
}

export default VerifyEmail