import Grid from "@mui/material/Grid";
import InputSearch from "components/InputSearch";
import useDebounce from "hooks/useDebounce";
import { UserGetSolutions } from "models/solution";
import React, { memo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setLoading, setErrorMess } from "redux/reducers/Status/actionTypes";
import classes from "./styles.module.scss";
import { Solution, SolutionCategory } from "models/Admin/solution";
import { SolutionService } from "services/solution";
import { DataPagination, EStatus } from "models/general";
import { Chip, Stack, useMediaQuery, useTheme } from "@mui/material";
import clsx from "clsx";
import images from "config/images";
import Button, { BtnType } from "components/common/buttons/Button";
import PopupInforSolution from "pages/ProjectManagement/components/PopupInforSolution";
import Heading1 from "components/common/text/Heading1";
import SubTitle from "components/common/text/SubTitle";
import BodySmall from "components/common/text/BodySmall";
import LaunchIcon from "@mui/icons-material/Launch";
import MobileBody from "components/common/text/MobileBody";
import CheckIcon from "@mui/icons-material/Check";
import TextBtnSmall from "components/common/text/TextBtnSmall";

interface SolutionListProps {
  solutionShow?: Solution;
  handleNextStep: () => void;
  onChangeSolution?: (solution: Solution) => void;
}

const SolutionList = memo(
  ({ handleNextStep, solutionShow, onChangeSolution }: SolutionListProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const theme = useTheme();
    const [keyword, setKeyword] = useState<string>("");
    const [category, setCategory] = useState<SolutionCategory>();
    const [solution, setSolution] = useState<DataPagination<Solution>>();
    const [solutionCategory, setSolutionCategory] =
      useState<DataPagination<SolutionCategory>>();
    const [isReadMore, setIsReadMore] = useState<boolean>(false);
    const isMobile = useMediaQuery(theme.breakpoints.down(767));

    const getSolutions = async (value: {
      keyword?: string;
      categoryId?: number;
    }) => {
      dispatch(setLoading(true));
      const params: UserGetSolutions = {
        take: 99999,
        keyword: keyword,
        categoryId: category?.id || undefined,
      };
      if (value?.keyword !== undefined) {
        params.keyword = value.keyword || undefined;
      }
      if (value.categoryId !== undefined) {
        params.categoryId = value.categoryId;
      }
      SolutionService.getSolutions(params)
        .then((res) => {
          setSolution({
            data: res.data,
            meta: res.meta,
          });
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    };
    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
      _onSearch(e.target.value);
    };
    const _onSearch = useDebounce(
      (keyword: string) => getSolutions({ keyword }),
      500
    );
    const onChangeCategory = (item?: SolutionCategory) => {
      if (category?.id === item?.id) return;
      setCategory(item);
      getSolutions({ categoryId: item?.id || null });
    };
    const handleSolutionShow = (item: Solution) => {
      onChangeSolution(item);
    };
    useEffect(() => {
      const fetchData = async () => {
        dispatch(setLoading(true));
        Promise.all([
          SolutionService.getSolutions({ take: 99999 }),
          SolutionService.getSolutionCategories({ take: 99999 }),
        ])
          .then((res) => {
            setSolution({
              data: res[0].data,
              meta: res[0].meta,
            });
            setSolutionCategory({
              data: res[1].data,
              meta: res[1].meta,
            });
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)));
      };
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);
    return (
      <>
        <Grid className={classes.header}>
          <Heading1
            className={classes.title}
            $colorName={"--cimigo-blue"}
            translation-key="project_create_tab_solution_select_solution"
          >
            {t("project_create_tab_solution_select_solution")}
          </Heading1>
        </Grid>
        <Grid className={classes.headerContentInput2}>
          <InputSearch
            placeholder={t("project_create_tab_solution_search_solution")}
            translation-key="project_create_tab_solution_search_solution"
            value={keyword || ""}
            onChange={onSearch}
            width={"100%"}
          />
        </Grid>
        <Grid className={classes.headerContent}>
          <Stack direction="row" spacing={1} className={classes.stack}>
            <Chip 
            label={t('common_all')} 
            translation-key="common_all" 
            className={clsx(classes.category, { [classes.categorySelected]: !category?.id })} 
            clickable 
            variant="outlined" 
            onClick={() => onChangeCategory()}/>
            {solutionCategory?.data.map((item) => (
              <Chip
                key={item.id}
                label={item.name}
                className={clsx(classes.category, {
                  [classes.categorySelected]: item.id === category?.id,
                })}
                clickable
                variant="outlined"
                onClick={() => onChangeCategory(item)}
              />
            ))}
          </Stack>
          <Grid className={classes.headerContentInput}>
            <InputSearch
              placeholder={t("project_create_tab_solution_search_solution")}
              translation-key="project_create_tab_solution_search_solution"
              value={keyword || ""}
              onChange={onSearch}
            />
          </Grid>
        </Grid>
        <Grid className={classes.body}>
          {solution?.data.map((item, index) => {
            const selected = item.id === solutionShow?.id;
            switch (item.status) {
              case EStatus.Active:
                return (
                  <Grid
                    key={index}
                    className={clsx(
                      { [classes.cardSelect]: selected },
                      classes.card
                    )}
                    onClick={() => handleSolutionShow(item)}
                  >
                    <div>
                      <Grid className={classes.titleCard}>
                        <img
                          className={classes.imgCard}
                          src={item.image}
                          alt="solution"
                        />
                        <SubTitle $colorName={"--cimigo-blue"}>
                          {item.title}
                        </SubTitle>
                      </Grid>
                      <BodySmall>{item.description}</BodySmall>
                    </div>
                    <Grid className={classes.btnReadMore}>
                      <Button
                        translation-key="common_read_more"
                        className={classes.btnReadMoreRoot}
                        classes={{ disabled: classes.btndisabled }}
                        disabled={!selected}
                        onClick={() => setIsReadMore(true)}
                        startIcon={
                          <>
                            <LaunchIcon
                              className={classes.icReadMore}
                            ></LaunchIcon>
                            <LaunchIcon
                              className={classes.icReadMoreGray}
                            ></LaunchIcon>
                          </>
                        }
                      >
                        <TextBtnSmall>{t("common_read_more")}</TextBtnSmall>
                      </Button>
                      <div className={classes.ticketBox}>
                        <img src={images.icTicked} alt="" />
                        <CheckIcon></CheckIcon>
                      </div>
                    </Grid>
                  </Grid>
                );
              case EStatus.Coming_Soon:
                return (
                  <Grid key={index} className={classes.cardComing}>
                    <Grid className={classes.titleComing}>
                      <MobileBody
                        $colorName={"--eerie-black-65"}
                        translation-key="project_create_tab_solution_coming_soon"
                      >
                        {t("project_create_tab_solution_coming_soon")}
                      </MobileBody>
                    </Grid>
                    <Grid sx={{ padding: "0 24px 32px" }}>
                      <Grid className={classes.titleCard}>
                        <img
                          className={classes.imgCard}
                          src={item.image}
                          alt="solution"
                        />
                        <SubTitle $colorName={"--gray-60"}>
                          {item.title}
                        </SubTitle>
                      </Grid>
                      <BodySmall $fontWeight={"500px"} $colorName={"--gray-40"}>
                        {item.description}
                      </BodySmall>
                    </Grid>
                  </Grid>
                );
              default:
                return null;
            }
          })}
        </Grid>
        <Grid className={classes.footerSelected}>
          <Grid>
            {!solutionShow ? (
              <MobileBody
                $colorName={"--cimigo-danger"}
                translation-key="project_create_tab_solution_no_solution_select"
              >
                {t("project_create_tab_solution_no_solution_select")}
              </MobileBody>
            ) : (
              <>
                <MobileBody
                  $colorName={"--eerie-black"}
                  translation-key="project_create_tab_solution_selected_solution"
                >
                  {t("project_create_tab_solution_selected_solution")}
                </MobileBody>
                <SubTitle $colorName={"--cimigo-green-dark-2"}>
                  {solutionShow?.title}
                </SubTitle>
              </>
            )}
          </Grid>
          <Button
            onClick={() => handleNextStep()}
            disabled={!solutionShow}
            children={t("project_create_tab_solution_get_started")}
            translation-key="project_create_tab_solution_get_started"
            btnType={BtnType.Primary}
            padding="16px"
            className={classes.btnMobile}
          />
        </Grid>
        <PopupInforSolution
          solution={(isMobile && isReadMore) || !isMobile ? solutionShow : null}
          onSelect={() => handleNextStep()}
          onCancel={() => {
            setIsReadMore(false);
            if (!isMobile) onChangeSolution(undefined);
          }}
        />
      </>
    );
  }
);
export default SolutionList;
