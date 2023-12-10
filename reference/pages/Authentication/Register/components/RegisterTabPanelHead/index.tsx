import { Grid } from "@mui/material"
import HeadLineSmall from "components/common/headline/Small"
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import classes from "./styles.module.scss"
import ParagraphSmall from "components/common/text/ParagraphSmall";
interface Props {
  children: React.ReactNode
}
const RegisterTabPanelHead = ({ children }: Props) => {
  const { isUsingGuest } = useSelector((state: ReducerType) => state.user);

  const { t } = useTranslation()


  return <Grid sx={{ marginBottom: '32px' }}>
    <HeadLineSmall translation-key="register_title">{t('register_title')}</HeadLineSmall>
    {isUsingGuest ? (
      <div className={classes.alertLoginGuest}>
        <ParagraphSmall
          $colorName="--gray-80"
          translation-key="project_guest_register_announcement"
          dangerouslySetInnerHTML={{
            __html: t("project_guest_register_announcement"),
          }}
        ></ParagraphSmall>
      </div>
    ) :
      children
    }

  </Grid>

}


export default RegisterTabPanelHead