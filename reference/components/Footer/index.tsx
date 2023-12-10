import { memo } from "react";
import classes from './styles.module.scss';
import facebookIcon from 'assets/img/fb-icon.svg';
import lnIcon from 'assets/img/ln-icon.svg';
import twitterIcon from 'assets/img/twitter-icon.svg';
import youtubeIcon from 'assets/img/youtube-icon.svg';
import { useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { routesOutside } from "routers/routes";


interface FooterProps {

}

const Footer = memo((props: FooterProps) => {
  const { t, i18n } = useTranslation()

  const [aboutWidgetMobile, setAboutWidgetMobile] = useState<boolean>(false)
  const [contactWidgetMobile, setContactWidgetMobile] = useState<boolean>(false)

  return (
    <>
      <footer className={classes.root}>
        <div className={classes.footerWidget1}>
          <div className={classes.containerWidget1}>
            <a href={`mailto:ask@cimigo.com`} className={classes.emailContact} translation-key="footer_contact_us_at">
              {t('footer_contact_us_at')}
            </a>
            <div className={classes.linkSocial}>
              <div className={classes.socialContact}>
                <a href="https://www.facebook.com/CimigoVietnam" className={classes.socialContactIcon}>
                  <img src={facebookIcon} alt="facebook logo" />
                </a>
                <a href="https://www.linkedin.com/company/cimigo/?originalSubdomain=vn" className={classes.socialContactIcon}>
                  <img src={lnIcon} alt="linkedin logo" />
                </a>
                <a href="https://twitter.com/cimigovietnam?lang=en" className={classes.socialContactIcon}>
                  <img src={twitterIcon} alt="twitter logo" />
                </a>
                <a href="https://www.youtube.com/channel/UC1lq4ngOGWl7NqGfsCOGbTA" className={classes.socialContactIcon}>
                  <img src={youtubeIcon} alt="youtube logo" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.footerWidget2}>
          <div className={classes.containerWidget2}>
            <div className={classes.leftContainer}>
              <div className={classes.aboutWidget}>
                <div className={classes.header}>
                  <p className={classes.textDescription} translation-key="footer_about_title">
                    {t('footer_about_title')}
                  </p>
                </div>
                <div className={classes.body}>
                  <a href={routesOutside(i18n.language)?.homePage} className={classes.textLink} translation-key="footer_about_home_page">
                    {t('footer_about_home_page')}
                  </a>
                  <a href={routesOutside(i18n.language)?.opportunitiesAtCimigo} className={classes.textLink} translation-key="footer_about_opportunities_at_cimigo">
                    {t('footer_about_opportunities_at_cimigo')}
                  </a>
                  <a href={routesOutside(i18n.language)?.trends} className={classes.textLink} translation-key="footer_about_trends">
                    {t('footer_about_trends')}
                  </a>
                  <a href={routesOutside(i18n.language)?.reports} className={classes.textLink} translation-key="footer_about_reports">
                    {t('footer_about_reports')}
                  </a>
                </div>
              </div>
              <div className={classes.contactWidget}>
                <div className={classes.header}>
                  <p className={classes.textDescription} translation-key="footer_contact_us_title">
                    {t('footer_contact_us_title')}
                  </p>
                </div>
                <div className={classes.body}>
                  <a href={`tel:+(84)2838227727`} className={classes.textLink} translation-key="footer_contact_us_phone">
                    {t('footer_contact_us_phone')}
                  </a>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className={classes.textLink} translation-key="footer_contact_us_address">
                    {t('footer_contact_us_address')}
                  </a>
                  <a href={`mailto:ask@cimigo.com`} className={classes.textLink} translation-key="footer_contact_us_email">
                    {t('footer_contact_us_email')}
                  </a>
                </div>
              </div>
              <div className={classes.aboutWidgetMobile}>
                <button className={classes.headerMobile} onClick={() => setAboutWidgetMobile(!aboutWidgetMobile)}>
                  <p className={classes.textDescriptionMobile} translation-key="footer_about_title">
                    {t('footer_about_title')}
                  </p>
                  <div className={classes.iconOpen}></div>
                </button>
                <div className={clsx(classes.bodyMobile, {
                  [classes.bodyActive]: aboutWidgetMobile
                })}>
                  <a href={routesOutside(i18n.language)?.homePage} className={classes.textLink} translation-key="footer_about_home_page">
                    {t('footer_about_home_page')}
                  </a>
                  <a href={routesOutside(i18n.language)?.opportunitiesAtCimigo} className={classes.textLink} translation-key="footer_about_opportunities_at_cimigo">
                    {t('footer_about_opportunities_at_cimigo')}
                  </a>
                  <a href={routesOutside(i18n.language)?.trends} className={classes.textLink} translation-key="footer_about_trends">
                    {t('footer_about_trends')}
                  </a>
                  <a href={routesOutside(i18n.language)?.reports} className={classes.textLink} translation-key="footer_about_reports">
                    {t('footer_about_reports')}
                  </a>
                </div>
              </div>
              <div className={classes.contactWidgetMobile}>
                <button className={classes.headerMobile} onClick={() => setContactWidgetMobile(!contactWidgetMobile)}>
                  <p className={classes.textDescriptionMobile} translation-key="footer_contact_us_title">
                    {t('footer_contact_us_title')}
                  </p>
                  <div className={classes.iconOpen}></div>
                </button>
                <div className={clsx(classes.bodyMobile, {
                  [classes.bodyActive]: contactWidgetMobile
                })}>
                  <a href={`tel:+(84)2838227727`} className={classes.textLink} translation-key="footer_contact_us_phone">
                    {t('footer_contact_us_phone')}
                  </a>
                   {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className={classes.textLink} translation-key="footer_contact_us_address">
                    {t('footer_contact_us_address')}
                  </a>
                  <a href={`mailto:ask@cimigo.com`} className={classes.textLink} translation-key="footer_contact_us_email">
                    {t('footer_contact_us_email')}
                  </a>
                </div>
              </div>
            </div>
            <div className={classes.rightContainer}>
              <div className={classes.mapController}>
                <iframe
                  className={classes.iframcustom}
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.143389361975!2d106.70470321533422!3d10.800327961704012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2ccdd7be3%3A0x2e94e0c1b1e3a835!2sCimigo%20Market%20Research!5e0!3m2!1sen!2s!4v1618030557324!5m2!1sen!2s"
                  allowFullScreen loading="lazy"
                  frameBorder="0"
                  width="600"
                  height="450"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.footerWidget3}>
          <div className={classes.containerWidget3}>
            <div className={classes.textCopyRight}>Copyright@2021.Cimigo</div>
            &nbsp; | &nbsp;
            <a href={routesOutside(i18n.language)?.privacyPolicy} className={classes.textPrivacy} translation-key="footer_privacy_policy">{t('footer_privacy_policy')}</a>
          </div>
        </div>
      </footer>
    </>
  )
})

export default Footer