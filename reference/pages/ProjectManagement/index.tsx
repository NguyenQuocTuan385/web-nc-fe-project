import { memo, useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useHistory } from "react-router-dom";
import { routes } from "routers/routes";
import InputSearch from "components/InputSearch";
import { useDispatch, useSelector } from "react-redux";
import { DataPagination, OptionItem, SortItem } from "models/general";
import { GetMyProjects, Project, projectStatus } from "models/project";
import { ProjectService } from "services/project";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import SearchNotFound from "components/SearchNotFound";
import { push } from "connected-react-router";
import { FolderService } from "services/folder";
import { Folder } from "models/folder";
import clsx from "clsx";
import { ReducerType } from "redux/reducers";
import { setVerifiedSuccess } from "redux/reducers/User/actionTypes";
import { CheckCircle, Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";
import Button, { BtnType } from "components/common/buttons/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import Heading1 from "components/common/text/Heading1";
import Heading5 from "components/common/text/Heading5";
import ChipProjectStatus from "components/common/status/ChipProjectStatus";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PopupConfirmChangeNameProject, {
  RenameProjectFormData,
} from "./components/PopupConfirmChangeNameProject";
import PopupConfirmMoveProject from "./components/PopupConfirmMoveProject";
import PopupConfirmDeleteProject from "./components/PopupConfirmDeleteProject";
import PopupConfirmCreateOrEditFolder from "./components/PopupConfirmCreateOrEditFolder";
import PopupConfirmDeleteFolder from "./components/PopupConfirmDeleteFolder";
import SubTitle from "components/common/text/SubTitle";
import BasicLayout from "layout/BasicLayout";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { Helmet } from "react-helmet";
import { ProjectStatus as ProjectStatus } from "models/project";
import usePermissions from 'hooks/usePermissions';

const ExpandIcon = (props) => {
  return <KeyboardArrowDownIcon {...props} sx={{ color: "var(--gray-60)" }} />;
};

const ArrowDropdownIcon = (props) => {
  return <ArrowDropDownIcon {...props} sx={{ color: "var(--eerie-black-40)", fontSize: "20px !important" }} />;
}
enum SortedField {
  name = "name",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
}

const paramsDefault: GetMyProjects = {
  take: 10,
  page: 1,
  sortedField: SortedField.updatedAt,
  isDescending: true,
}

interface Props { }

const ProjectManagement = memo((props: Props) => {
  const { t, i18n } = useTranslation();

  const history = useHistory();
  const dispatch = useDispatch();

  const { verifiedSuccess } = useSelector((state: ReducerType) => state.user);

  const [keyword, setKeyword] = useState<string>("");
  const [params, setParams] = useState<GetMyProjects>({ ...paramsDefault })
  const [data, setData] = useState<DataPagination<Project>>();

  const [itemAction, setItemAction] = useState<Project>(null);
  const [itemDelete, setItemDelete] = useState<Project>(null);
  const [itemMove, setItemMove] = useState<Project>(null);
  const [itemRename, setItemRename] = useState<Project>(null);
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

  const [folders, setFolders] = useState<Folder[]>();
  const [folderEdit, setFolderEdit] = useState<Folder>(null);
  const [folderDelete, setFolderDelete] = useState<Folder>(null);
  const [createFolder, setCreateFolder] = useState(false);

  const { isAllowDeleteProject, isAllowRenameProject, isAllowMoveProject } = usePermissions(itemAction)

  const fetchData = async () => {
    dispatch(setLoading(true));
    await ProjectService.getMyProjects(params)
      .then((res) => {
        setData({ data: res.data, meta: res.meta });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const _onSearch = useDebounce(
    (keyword: string) => {
      setParams({ ...params, keyword, page: 1 })
    },
    500
  );

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    _onSearch(e.target.value);
  };

  const onChangeStatus = (value: number) => {
    if (params?.statusIds?.includes(value)) return;
    setParams({ ...params, statusIds: value ? [value] : null })
  };
  const onChangeFolderMobile = (folderId: number) => {
    const folder = folders.find((it: Folder) => it.id === folderId);
    setParams({ ...params, folderIds: folder ? [folder.id] : null })
  };

  const onChangeFolder = (item?: Folder) => {
    if (params?.folderIds?.includes(item?.id)) return;
    setParams({ ...params, folderIds: item ? [item.id] : null })
  };

  const onChangeSort = (name: SortedField) => {
    const _params = { ...params }
    if (_params?.sortedField === name) {
      _params.isDescending = !_params.isDescending
    } else {
      _params.sortedField = name
      _params.isDescending = true
    }
    setParams(_params)
  };

  const getMyFolders = async () => {
    await FolderService.getFolders({ take: 9999 })
      .then((res) => {
        setFolders(res.data);
        if (params?.folderIds?.length) {
          const item = res.data.find((it: Folder) => params.folderIds.includes(it.id));
          if (!item) onChangeFolder();
        }
      })
      .catch((e) => dispatch(setErrorMess(e)));
  };

  useEffect(() => {
    fetchData();
    getMyFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: Project
  ) => {
    setItemAction(item);
    setActionAnchor(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
  };

  const gotoDetail = () => {
    onCloseActionMenu();
    dispatch(
      push(routes.project.detail.root.replace(":id", `${itemAction.id}`))
    );
  };

  const onShowConfirmDelete = () => {
    if (!itemAction) return;
    onCloseActionMenu();
    setItemDelete(itemAction);
  };

  const onCloseConfirmDelete = () => {
    setItemDelete(null);
  };

  const onDelete = (projectId: number) => {
    if (!projectId) return;
    onCloseConfirmDelete();
    dispatch(setLoading(true));
    ProjectService.deleteProject(projectId)
      .then((res) => {
        fetchData();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onCreateOrEditFolder = (name: string) => {
    if (folderEdit) {
      dispatch(setLoading(true));
      FolderService.update(folderEdit.id, { name })
        .then(() => {
          getMyFolders();
          onCloseCreateOrEditFolder();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    } else {
      dispatch(setLoading(true));
      FolderService.create({ name })
        .then(() => {
          getMyFolders();
          onCloseCreateOrEditFolder();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    }
  };

  const onCloseCreateOrEditFolder = () => {
    setCreateFolder(false);
    setFolderEdit(null);
  };

  const onDeleteFolder = (folderId: number) => {
    if (!folderId) return;
    dispatch(setLoading(true));
    FolderService.delete(folderId)
      .then(async () => {
        setFolderDelete(null);
        await fetchData();
        getMyFolders();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onShowMoveProject = () => {
    if (!itemAction) return;
    setItemMove(itemAction);
    onCloseActionMenu();
  };

  const onCloseMoveProject = () => {
    setItemMove(null);
  };

  const onMoveProject = (item?: OptionItem) => {
    if (!itemMove) return;
    dispatch(setLoading(true));
    ProjectService.moveProject(itemMove.id, {
      folderId: item?.id || null,
    })
      .then(async () => {
        await fetchData();
        onCloseMoveProject();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onShowRenameProject = () => {
    if (!itemAction) return;
    setItemRename(itemAction);
    onCloseActionMenu();
  };

  const onCloseRenameProject = () => {
    setItemRename(null);
  };

  const onRenameProject = (data: RenameProjectFormData) => {
    if (!itemRename) return;
    ProjectService.renameProject(itemRename.id, data)
      .then(() => {
        fetchData();
        onCloseRenameProject();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onClickRow = (id: number) => {
    dispatch(push(routes.project.detail.root.replace(":id", `${id}`)));
  };

  const onClearVerifiedSuccess = () => {
    dispatch(setVerifiedSuccess(false));
  };

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => {
    setParams({ ...params, page: newPage + 1 })
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParams({
      ...params,
      take: Number(event.target.value),
      page: 1
    })
  };

  const inValidPage = () => {
    if (!data) return false
    return data.meta.page > 1 && Math.ceil(data.meta.itemCount / data.meta.take) < data.meta.page
  }

  const pageIndex = useMemo(() => {
    if (!data) return 0
    if (inValidPage()) return data.meta.page - 2
    return data.meta.page - 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (inValidPage()) {
      handleChangePage(null, data.meta.page - 2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <BasicLayout className={classes.root}>
      <Helmet>
        <title>RapidSurvey - Project management</title>
      </Helmet>
      {verifiedSuccess && (
        <Grid className={classes.successBoxContainer}>
          <div className={classes.successBox}>
            <CheckCircle className={classes.successIcon} />
            <span
              className={classes.successText}
              translation-key="auth_your_email_is_successfully_verified"
            >
              {t("auth_your_email_is_successfully_verified")}
            </span>
            <IconButton
              className={classes.successBtn}
              onClick={onClearVerifiedSuccess}
            >
              <Close />
            </IconButton>
          </div>
        </Grid>
      )}
      <Grid className={classes.container}>
        <Grid className={classes.left}>
          <Heading4
            className={classes.titleLeft}
            $colorName={"--eerie-black-65"}
            translation-key="project_mgmt_your_folders"
          >
            {t("project_mgmt_your_folders")}
          </Heading4>
          <List className={classes.list} component="nav">
            <ListItem
              classes={{
                root: clsx(classes.rootList, {
                  [classes.folderListItemSelected]: !params?.folderIds?.length,
                }),
              }}
              disablePadding
              onClick={() => onChangeFolder()}
            >
              <ListItemButton className={classes.folderListItemAll}>
                <ListItemText>
                  <ParagraphBody
                    className={classes.itemAll}
                    $colorName={
                      params?.folderIds?.length ? "--eerie-black" : "--ghost-white"
                    }
                    translation-key="project_mgmt_all_projects"
                  >
                    {t("project_mgmt_all_projects")}{" "}
                  </ParagraphBody>
                </ListItemText>
              </ListItemButton>
            </ListItem>
            {folders?.map((item, index) => (
              <ListItem
                key={index}
                classes={{
                  root: clsx(classes.rootList, {
                    [classes.folderListItemSelected]: params?.folderIds?.includes(item.id),
                  }),
                }}
                onClick={() => onChangeFolder(item)}
                secondaryAction={
                  <div className={classes.btnAction}>
                    <IconButton
                      classes={{ root: classes.iconAction }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderEdit(item);
                      }}
                    >
                      <DriveFileRenameOutlineIcon />
                    </IconButton>
                    <IconButton
                      classes={{ root: classes.iconAction }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderDelete(item);
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </div>
                }
                disablePadding
              >
                <ListItemButton className={classes.folderListItem}>
                  <ListItemText>
                    <ParagraphBody
                      className={classes.item}
                      $colorName={"--eerie-black"}
                    >
                      {item.name}{" "}
                    </ParagraphBody>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Button
              className={classes.btnFolder}
              translation-key="project_mgmt_create_folder"
              btnType={BtnType.Outlined}
              startIcon={<AddCircleIcon />}
              onClick={() => setCreateFolder(true)}
            >
              <TextBtnSmall $colorName={"--cimigo-blue"}>
                {t("project_mgmt_create_folder")}
              </TextBtnSmall>
            </Button>
          </List>
        </Grid>
        <Grid className={classes.right}>
          <Grid className={classes.header}>
            <Box className={classes.headerLeft}>
              <Heading1
                className={classes.titleRight}
                $colorName={"--cimigo-blue"}
                translation-key="project_mgmt_title"
              >
                {t("project_mgmt_title")}
              </Heading1>
              <Box className={classes.headerLeftSub}>
                <InputSearch
                  sx={{ minHeight: "40px", minWidth: "256px" }}
                  className={classes.inputSearch}
                  placeholder={t("project_mgmt_search")}
                  translation-key="project_mgmt_search"
                  value={keyword || ""}
                  onChange={onSearch}
                />
                <FormControl classes={{ root: classes.rootSelect }}>
                  <Select
                    sx={{ minWidth: "147px", minHeight: "40px" }}
                    variant="outlined"
                    value={params?.statusIds?.[0] || 0}
                    onChange={(e) => onChangeStatus(e.target.value as number)}
                    classes={{
                      select: classes.selectType,
                      icon: classes.icSelect,
                    }}
                    IconComponent={ExpandIcon}
                    MenuProps={{
                      classes: {
                        paper: classes.selectMenu,
                      },

                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center"
                      },
                    }}
                  >
                    <MenuItem
                      value={0}
                      translation-key="project_mgmt_status_all_status"
                      className={classes.itemStatus}
                    >
                      <ParagraphBody pr={1} $colorName="--gray-80">
                        {t("project_mgmt_status_all_status")}
                      </ParagraphBody>
                    </MenuItem>
                    {projectStatus.map((item) => (
                      <MenuItem
                        className={classes.itemStatus}
                        key={item.id}
                        value={item.id}
                        translation-key={typeof item.translation === 'function' ? item.translation(item.name) : item.translation}
                      >
                        <ParagraphBody pr={1} $colorName="--gray-80">
                          {t(typeof item.translation === 'function' ? item.translation(item.id) : item.translation)}
                        </ParagraphBody>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box className={classes.headerRight}>
              <Button
                translation-key="project_mgmt_create_project"
                btnType={BtnType.Primary}
                startIcon={<AddCircleIcon />}
                type="button"
                onClick={() => history.push(routes.project.create)}
              >
                <TextBtnSmall $colorName={"--white"}>
                  {t("project_mgmt_create_project")}
                </TextBtnSmall>
              </Button>
            </Box>
          </Grid>
          <TableContainer className={classes.table}>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={params?.sortedField === SortedField.name}
                      direction={params?.isDescending ? "desc" : "asc"}
                      onClick={() => {
                        onChangeSort(SortedField.name);
                      }}
                    >
                      <Heading5
                        $colorName={"--cimigo-blue"}
                        translation-key="project_mgmt_column_name"
                      >
                        {t("project_mgmt_column_name")}
                      </Heading5>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <Heading5
                      $colorName={"--cimigo-blue"}
                      translation-key="project_mgmt_column_status"
                    >
                      {t("project_mgmt_column_status")}
                    </Heading5>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={params?.sortedField === SortedField.updatedAt}
                      direction={params?.isDescending ? "desc" : "asc"}
                      onClick={() => {
                        onChangeSort(SortedField.updatedAt);
                      }}
                      IconComponent={ArrowDropdownIcon}
                    >
                      <Heading5
                        $colorName={"--cimigo-blue"}
                        translation-key="project_mgmt_column_last_modified"
                      >
                        {t("project_mgmt_column_last_modified")}
                      </Heading5>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <Heading5
                      $colorName={"--cimigo-blue"}
                      translation-key="project_mgmt_column_solution"
                    >
                      {t("project_mgmt_column_solution")}
                    </Heading5>
                  </TableCell>
                  <TableCell align="center">
                    <Heading5
                      $colorName={"--cimigo-blue"}
                      translation-key="project_mgmt_column_action"
                    >
                      {t("project_mgmt_column_action")}
                    </Heading5>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.length ? (
                  data?.data?.map((item) => (
                    <TableRow
                      onClick={() => onClickRow(item.id)}
                      key={item.id}
                      className={classes.tableBody}
                    >
                      <TableCell>
                        <ParagraphBody $colorName={"--eerie-black"}>
                          {item.name}
                        </ParagraphBody>{" "}
                      </TableCell>
                      <TableCell>
                        <ChipProjectStatus
                          status={item.status}
                          solutionTypeId={item?.solution?.typeId}
                        ></ChipProjectStatus>
                      </TableCell>
                      <TableCell>
                        <ParagraphBody $colorName={"--eerie-black"}>
                          {moment(item.updatedAt).format("DD-MM-yyyy")}
                        </ParagraphBody>
                      </TableCell>
                      <TableCell>
                        <ParagraphBody $colorName={"--eerie-black"}>
                          {item.solution?.title}
                        </ParagraphBody>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAction(event, item);
                          }}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className={classes.tableBody}>
                    <TableCell align="center" colSpan={5}>
                      <Box sx={{ py: 3 }}>
                        <SearchNotFound
                          messs={t("project_mgmt_project_not_found")}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              labelRowsPerPage={t("common_row_per_page")}
              labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) {
                return t("common_row_of_page", { from: from, to: to, count: count });
              }}
              component="div"
              count={data?.meta?.itemCount || 0}
              rowsPerPage={data?.meta?.take || 10}
              page={pageIndex}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Menu
            anchorEl={actionAnchor}
            open={Boolean(actionAnchor)}
            onClose={onCloseActionMenu}
            classes={{ paper: classes.menuAction }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MenuItem className={classes.itemAciton} onClick={gotoDetail}>
              <RemoveRedEyeIcon />
              <ParagraphBody
                $colorName={"--gray-80"}
                translation-key="project_mgmt_action_view_details"
              >
                {t("project_mgmt_action_view_details")}
              </ParagraphBody>
            </MenuItem>
            {
              !!isAllowRenameProject && (
              <MenuItem
                className={classes.itemAciton}
                onClick={() => onShowRenameProject()}
              >
                <DriveFileRenameOutlineIcon />
                <ParagraphBody
                  $colorName={"--gray-80"}
                  translation-key="project_mgmt_action_rename"
                >
                  {t("project_mgmt_action_rename")}
                </ParagraphBody>
              </MenuItem>
              )
            }
            {
              !!isAllowMoveProject && (
              <MenuItem
                className={classes.itemAciton}
                onClick={() => onShowMoveProject()}
              >
                <DriveFileMoveIcon />
                <ParagraphBody
                  $colorName={"--gray-80"}
                  translation-key="project_mgmt_action_move"
                >
                  {t("project_mgmt_action_move")}
                </ParagraphBody>
              </MenuItem>
              )
            }  
            {
              !!isAllowDeleteProject && (
                <MenuItem
                  className={clsx(classes.itemAciton, classes.itemAcitonDelete)}
                  onClick={onShowConfirmDelete}
                >
                  <DeleteForeverIcon />
                  <ParagraphBody
                    $colorName={"--red-error"}
                    translation-key="project_mgmt_action_delete"
                  >
                    {t("project_mgmt_action_delete")}
                  </ParagraphBody>
                </MenuItem>
              )
            }
          </Menu>
        </Grid>
      </Grid>
      {/* =================================Mobile=============================== */}

      <Grid className={classes.containerMobile}>
        <Button
          children={
            <TextBtnSmall $colorName={"--white"}>
              {t("project_mgmt_create_project")}
            </TextBtnSmall>
          }
          padding="11px"
          fullWidth
          translation-key="project_mgmt_create_project"
          btnType={BtnType.Primary}
          endIcon={<AddCircleIcon />}
          type="button"
          onClick={() => history.push(routes.project.create)}
        />
        <InputSearch
          placeholder={t("project_mgmt_search")}
          width="100%"
          translation-key="project_mgmt_search"
          value={keyword || ""}
          onChange={onSearch}
          className={classes.inputMobile}
        />
        <Grid className={classes.headerMobile}>
          <SubTitle
            $colorName="--cimigo-blue"
            translation-key="project_mgmt_title"
          >
            {t("project_mgmt_title")}
          </SubTitle>
          <FormControl classes={{ root: classes.rootSelect }}>
            <Select
              sx={{ minHeight: "40px" }}
              variant="outlined"
              value={params?.folderIds?.[0] || 0}
              onChange={(e) => onChangeFolderMobile(e.target.value as number)}
              classes={{ select: classes.selectType, icon: classes.icSelect }}
              IconComponent={ExpandIcon}
              MenuProps={{
                classes: {
                  paper: classes.selectFolderMobile,
                },
              }}
            >
              <MenuItem value={0} translation-key="project_mgmt_all_projects">
                <ParagraphSmall pr={1} $colorName="--gray-90"> {t("project_mgmt_all_projects")}</ParagraphSmall>
              </MenuItem>
              {folders?.map((item) => (
                <MenuItem
                  key={item.id}
                  value={item.id}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <ParagraphSmall pr={1} className={classes.itemSelectMobie} $colorName="--gray-90">{item.name}</ParagraphSmall>
                  <div>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderEdit(item);
                      }}
                    >
                      <DriveFileRenameOutlineIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderDelete(item);
                      }}
                      sx={{ color: "var(--cimigo-danger)" }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid classes={{ root: classes.listProject }}>
          {data?.data?.length ? (
            data?.data?.map((item) => (
              <Grid
                sx={{ cursor: "pointer" }}
                key={item.id}
                classes={{ root: classes.listItemProject }}
                onClick={() => onClickRow(item.id)}
              >
                <div>
                  <p className={classes.itemNameMobile}>{item.name}</p>
                  <Grid sx={{ padding: "8px 0px 4px 0px" }}>
                    <ChipProjectStatus status={item.status} solutionTypeId={item?.solution?.typeId}></ChipProjectStatus>
                  </Grid>

                  <Grid
                    className={classes.itemDateMobile}
                    translation-key="project_mgmt_column_last_modified_mobile"
                  >
                    {t("project_mgmt_column_last_modified_mobile")}{" "}
                    {moment(item.updatedAt)
                      .locale(i18n.language)
                      .format("MMM DD, yyyy")}
                  </Grid>
                </div>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAction(event, item);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Grid>
            ))
          ) : (
            <SearchNotFound messs={t("project_mgmt_project_not_found")} />
          )}
        </Grid>
        <TablePagination
          labelRowsPerPage={t("common_row_per_page")}
          labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) {
            return t("common_row_of_page", { from: from, to: to, count: count });
          }}
          component="div"
          count={data?.meta?.itemCount || 0}
          rowsPerPage={data?.meta?.take || 10}
          page={pageIndex}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
      <PopupConfirmDeleteProject
        project={itemDelete}
        onCancel={onCloseConfirmDelete}
        onDelete={onDelete}
      />
      <PopupConfirmChangeNameProject
        project={itemRename}
        onCancel={onCloseRenameProject}
        onSubmit={onRenameProject}
      />
      <PopupConfirmMoveProject
        project={itemMove}
        folders={folders}
        onCancel={onCloseMoveProject}
        onMove={onMoveProject}
      />
      <PopupConfirmCreateOrEditFolder
        isOpen={createFolder || !!folderEdit}
        folder={folderEdit}
        onCancel={onCloseCreateOrEditFolder}
        onSubmit={(name) => onCreateOrEditFolder(name)}
      />
      <PopupConfirmDeleteFolder
        folder={folderDelete}
        onCancel={() => setFolderDelete(null)}
        onDelete={onDeleteFolder}
      />
    </BasicLayout>
  );
});
export default ProjectManagement;
