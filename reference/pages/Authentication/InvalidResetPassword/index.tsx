import { Box, Grid } from "@mui/material";
import { push } from "connected-react-router";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import classes from './styles.module.scss';
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import BasicLayout from "layout/BasicLayout";
import HeadLineSmall from "components/common/headline/Small";
import ParagraphSmallUnderline from 'components/common/text/ParagraphSmallUnderline';

interface Props {
}

const InvalidResetPassword = memo(({ }: Props) => {
  const dispatch = useDispatch()

  const { t } = useTranslation()

  return (
    <BasicLayout className={classes.root}>
      <Grid className={classes.body}>
        <HeadLineSmall translation-key="invalid_reset_password_title">{t('invalid_reset_password_title')}</HeadLineSmall>
        <ParagraphSmall $colorName="--gray-80" translation-key="invalid_reset_password_sub_title">{t('invalid_reset_password_sub_title')}</ParagraphSmall>
        <Button onClick={() => dispatch(push(routes.forgotPassword))} sx={{ marginY: '24px' }} translation-key="invalid_reset_password_btn_send" children={t('invalid_reset_password_btn_send')} btnType={BtnType.Primary} />
        <Box sx={{ textAlign: "center" }}>
          <ParagraphSmallUnderline to={routes.login} translation-key="invalid_reset_password_back_to_login">
            {t('invalid_reset_password_back_to_login')}
          </ParagraphSmallUnderline>
        </Box>
      </Grid>
    </BasicLayout>
  )
})

export default InvalidResetPassword