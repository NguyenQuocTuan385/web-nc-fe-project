import { Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { memo, useState, useRef, useMemo } from "react";
import classes from './styles.module.scss';
import cimigoLogo from 'assets/img/cimigo_logo_v1.5.svg';
import iconMenuOpen from 'assets/img/icon/menu-open.svg';
import clsx from "clsx";
import UseAuth from "hooks/useAuth";
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import Buttons from "components/Buttons";
import { routes, routesOutside } from "routers/routes";
import images from "config/images";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useTranslation } from "react-i18next";
import { KeyboardArrowDown } from "@mui/icons-material";
import { currencyTypes, langSupports } from "models/general";
import { Project } from "models/project";
import Inputs from "components/Inputs";
import { ProjectService } from "services/project";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import UserService from "services/user";
import { setUserLogin, setUserUsingGuest } from "redux/reducers/User/actionTypes";
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import ParagraphBody from 'components/common/text/ParagraphBody';
import Button from "components/common/buttons/Button";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import usePermissions from "hooks/usePermissions";
export interface HeaderProps {
  project?: boolean;
  detail?: Project;
}

const Header = memo(({ project, detail }: HeaderProps) => {
  const { t, i18n } = useTranslation()

  const history = useHistory();
  const dispatch = useDispatch()
  const { isLoggedIn, logout, user, isGuest } = UseAuth();
  const anchorRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [anchorElCurrency, setAnchorElCurrency] = useState<null | HTMLElement>(null);
  const openProfile = Boolean(anchorEl);
  const [isEdit, setIsEdit] = useState(false);
  const [projectName, setProjectName] = useState<string>('');
  const location = useLocation();

  const isAuthPage = useMemo(() => {
    return !![
      routes.login,
      routes.register,
      routes.forgotPassword,
      routes.resetPassword,
      routes.invalidResetPassword,
    ].find(path => matchPath(location.pathname, {
      path: path,
      exact: false
    }))
  }, [location])

  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dataList = useMemo(() => {
    return [
      {
        link: routesOutside(i18n.language)?.overview,
        name: t('header_menu_overview'),
      },
      {
        link: routesOutside(i18n.language)?.howItWorks,
        name: t('header_menu_how_it_works'),
      },
      {
        link: routesOutside(i18n.language)?.solution,
        name: t('header_menu_solution'),
      },
      {
        link: routesOutside(i18n.language)?.pricingPlans,
        name: t('header_menu_pricing'),
      },
      {
        link: routesOutside(i18n.language)?.faq,
        name: t('header_menu_FAQ'),
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])


  const onGoHome = () => {
    if (isLoggedIn) dispatch(push(routes.project.management))
    else dispatch(push(routes.login))
  }

  const changeLanguage = async (lang: string) => {
    setAnchorElLang(null)
    if (lang === i18n.language) return
    if (isLoggedIn) {
      dispatch(setLoading(true))
      await UserService.changeLanguage(lang)
        .finally(() => dispatch(setLoading(false)))
    }
    i18n.changeLanguage(lang, () => {
      window.location.reload()
    })
  }

  const changeCurrency = async (currency: string) => {
    setAnchorElCurrency(null)
    if (!isLoggedIn) return
    dispatch(setLoading(true))
    await UserService.changeCurrency(currency)
      .then(() => {
        dispatch(setUserLogin({...user, currency}))
      })
      .finally(() => dispatch(setLoading(false)))
  }

  const { isAllowRenameProject } = usePermissions()

  const handleEditProjectName = () => {
    if (!isAllowRenameProject) return;
    setIsEdit(true)
    setProjectName(detail.name)
  }

  const isValidProjectName = () => {
    return projectName && detail && projectName !== detail.name
  }

  const onCloseChangeProjectName = () => {
    setProjectName('')
    setIsEdit(false)
  }

  const onChangeProjectName = () => {
    if (!isValidProjectName()) {
      onCloseChangeProjectName()
      return
    }
    dispatch(setLoading(true))
    ProjectService.renameProject(detail.id, {
      name: projectName
    })
      .then(() => {
        onCloseChangeProjectName()
        dispatch(getProjectRequest(detail.id))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(true)))
  }

  const handleKeyPress = (e) => {
    var code = e.which;
    if (code === 13) {
      onChangeProjectName();
    }
  };
  const btnLogout = () => {
    dispatch(setUserUsingGuest(false));
    logout()
  }

  const renderBtn = ()=> {
    if (!isLoggedIn || (isLoggedIn && isGuest && isAuthPage)) {
      return (
        <>
          <li className={classes.item}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className={classes.btnLogin}>
              <Buttons btnType="TransparentBlue" children={t('header_login')} translation-key="header_login" padding="6px 16px" onClick={() => history.push(routes.login)} />
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className={classes.btnLogout}>
              <Buttons btnType="Blue" children={t('header_register')} translation-key="header_register" padding="6px 16px" onClick={() => history.push(routes.register)} />
            </a>
          </li>
        </>
      )
    }
    return  ( // isLoggedIn === true
      <>
        <li className={clsx(classes.item, classes.clearMargin)}>
          <Buttons
            className={classes.btnChangeLang}
            padding="7px 10px"
            onClick={(e) => setAnchorElCurrency(e.currentTarget)} endIcon={<KeyboardArrowDown />}
          >
            <span className={classes.desktop}>{currencyTypes?.find(it => it.id === user.currency).name}</span>
            <span className={classes.mobile}>{currencyTypes?.find(it => it.id === user.currency).subName}</span>
          </Buttons>
          <Menu
            anchorEl={anchorElCurrency}
            open={Boolean(anchorElCurrency)}
            onClose={() => setAnchorElCurrency(null)}
            classes={{ paper: clsx(classes.menuProfile, classes.menuLang) }}
          >
            {currencyTypes.map(it => (
              <MenuItem key={it.id} onClick={() => changeCurrency(it.id)} className={clsx(classes.itemAciton, { [classes.active]: it.id === user.currency })}>
                <p className={classes.itName}>{it.name}</p>
              </MenuItem>
            ))}
          </Menu>
        </li>
        {
          !isGuest ? (
            <li className={classes.item}>
              {/* <IconButton className={classes.itemBtn}>
                <img src={images.icHelp} alt="" className={classes.icHelp} />
              </IconButton> */}
              <IconButton onClick={handleClick} className={classes.itemBtn}>
                <img src={user?.avatar || images.icProfile} alt="" className={clsx(classes.avatar, { [classes.avatarEmpty]: !user?.avatar })} referrerPolicy="no-referrer" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openProfile}
                onClose={handleClose}
                MenuListProps={{
                  sx: { padding: 0 }
                }}
                classes={{ paper: classes.menuProfile }}
              >
                <MenuItem className={classes.itemAciton} onClick={() => history.push(routes.account.root)}>
                  <img src={images.icProfile} alt="" />
                  <p translation-key="auth_my_account">{t('auth_my_account')}</p>
                </MenuItem>
                <MenuItem className={classes.itemAciton} onClick={() => history.push(routes.paymentHistory)}>
                  <img src={images.icPaymentHistory} alt="" />
                  <p translation-key="auth_payment_history">{t("auth_payment_history")}</p>
                </MenuItem>
                <MenuItem className={classes.itemAciton} onClick={btnLogout}>
                  <img src={images.icLogout} alt="" />
                  <p translation-key="auth_log_out">{t('auth_log_out')}</p>
                </MenuItem>
              </Menu>
            </li>
          ) : (
            <li className={classes.item}>
              <Button
                sx={{marginRight: "24px"}}
                className={classes.btnLoginOrRegister}
                children={
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3"  translation-key="project_guest_login_register">
                    {t('project_guest_login_register')}
                  </ParagraphExtraSmall>
                }
                onClick = { () => {
                  dispatch(setUserUsingGuest(true));
                  dispatch(push(routes.login))
                }}
              />
            </li>
          )
        }
      </>
    )
  }

  return (
    <header className={clsx(classes.root, {[classes.headerLogin]: !isLoggedIn || (isLoggedIn && isGuest && isAuthPage)})} id="header">
      <div className={classes.container}>
        <li className={clsx(classes.item, classes.menuAction)}>
          <IconButton
            ref={anchorRef}
            onClick={() => setOpen(true)}
          >
            <img src={iconMenuOpen} alt="menu-action" />
          </IconButton>
          <Menu
            open={isOpen}
            onClose={() => setOpen(false)}
            anchorEl={anchorRef.current}
            classes={{ paper: classes.rootMenu }}
          >
            {/* {dataList.map(item => (
              <MenuItem key={item.name} className={classes.itemsOfToggle}>
                <a href={item.link} >
                  <p>{item.name}</p>
                </a>
              </MenuItem>
            ))} */}
            {!isLoggedIn && (
              <div>
                {/* <Grid className={classes.lineOfToggle} /> */}
                <button className={classes.buttonOfToggle} onClick={() => history.push(routes.login)}>
                  <img src={images.icArrowLogin} alt="" className={classes.icButtonOfToggle} />
                  <span translation-key="header_login">{t('header_login')}</span>
                </button>
                <button className={classes.buttonOfToggle} onClick={() => history.push(routes.register)}>
                  <img src={images.icArrowRegister} alt="" className={classes.icButtonOfToggle} />
                  <span translation-key="header_register">{t('header_register')}</span>
                </button>
              </div>
            )}
          </Menu>
        </li>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a onClick={onGoHome}>
          <div className={classes.imgContainer}>
            <img src={cimigoLogo} alt="cimigo" />
          </div>
        </a>
        {isLoggedIn &&
          <div className={classes.linkProject}>
            {project &&
              <div className={classes.linkTextHome} onClick={() => history.push(routes.project.management)} >
                <div className={classes.iconFolderProject} >
                  <TopicOutlinedIcon />
                </div>
                <div className={classes.headerProject}>
                  <ParagraphBody $fontWeight="500" $colorName="--gray-80" translation-key="header_projects">{t('header_projects')}</ParagraphBody>
                </div>
              </div>
            }
            {detail &&
              <div className={classes.linkTexDetail}>
                <img src={images.icNextMobile} alt='' />
                {!isEdit ? (
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  <a className={classes.detail} onClick={handleEditProjectName}>{detail.name}</a>
                ) : (
                  <div className={classes.editBox}>
                    <Inputs
                      name=""
                      size="small"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder={t('field_project_name_placeholder')}
                      translation-key-placeholder="field_project_name_placeholder"
                      onKeyPress={handleKeyPress}
                    />
                    <Buttons
                      id="btnProject"
                      nowrap
                      btnType="Blue"
                      translation-key="common_save"
                      children={t('common_save')}
                      padding="3px 13px"
                      startIcon={<img src={images.icSaveWhite} alt="" />}
                      onClick={onChangeProjectName}
                    />
                  </div>
                )}
              </div>
            }
          </div>
        }
        <nav className={classes.navBar}>
          <ul className={classes.listMenu}>
            {(!isLoggedIn || (isLoggedIn && isGuest && isAuthPage)) && (
              <div className={classes.listItem}>
                {/* {dataList.map(item => (
                  <li key={item.name} className={classes.item}>
                    <a href={item.link} className={classes.routerItem}>
                      {item.name}
                    </a>
                  </li>
                ))} */}
              </div>
            )}
            <li className={clsx(classes.item, classes.clearMargin)}>
              <Buttons
                className={classes.btnChangeLang}
                padding="7px 10px"
                onClick={(e) => setAnchorElLang(e.currentTarget)} endIcon={<KeyboardArrowDown />}
              >
                <span className={classes.desktop}>{langSupports?.find(it => it.key === i18n.language).name}</span>
                <span className={classes.mobile}>{langSupports?.find(it => it.key === i18n.language).key}</span>
              </Buttons>
              {/* <Buttons
                className={classes.btnChangeLang2}
                children={langSupports?.find(it => it.key === i18n.language).key}
                padding="7px 10px"
                onClick={(e) => setAnchorElLang(e.currentTarget)} endIcon={<KeyboardArrowDown />}
              /> */}
              <Menu
                anchorEl={anchorElLang}
                open={Boolean(anchorElLang)}
                onClose={() => setAnchorElLang(null)}
                classes={{ paper: clsx(classes.menuProfile, classes.menuLang) }}
              >
                {langSupports.map(it => (
                  <MenuItem key={it.key} onClick={() => changeLanguage(it.key)} className={clsx(classes.itemAciton, { [classes.active]: it.key === i18n.language })}>
                    <p className={classes.itName}>{it.name}</p>
                  </MenuItem>
                ))}
              </Menu>
            </li>
            {
              renderBtn()
            }
          </ul>
        </nav>
      </div>
    </header>
  )
})

export default Header