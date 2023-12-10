import { Add as AddIcon, DeleteOutlineOutlined, Done, EditOutlined, ExpandMoreOutlined, HideSource, ArrowBackOutlined } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Link, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import clsx from "clsx";
import InputSearch from "components/InputSearch";
import WarningModal from "components/Modal/WarningModal";
import SearchNotFound from "components/SearchNotFound";
import StatusChip from "components/StatusChip";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import useDebounce from "hooks/useDebounce";
import { AttributeCategory } from "models/Admin/attribute";
import { DataPagination, EStatus, LangSupport, langSupports, TableHeaderLabel } from "models/general";
import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import { AdminAttributeService } from "services/admin/attribute";
import classes from './styles.module.scss';

const tableHeaders: TableHeaderLabel[] = [
  { name: 'id', label: 'Id', sortable: false },
  { name: 'name', label: 'Name', sortable: false },
  { name: 'languages', label: 'Languages', sortable: false },
  { name: 'status', label: 'Status', sortable: false },
  { name: 'actions', label: 'Actions', sortable: false },
];

interface Props {
}

const AttributeCategoryList = memo((props: Props) => {

  const dispatch = useDispatch()
  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataPagination<AttributeCategory>>();
  const [itemAction, setItemAction] = useState<AttributeCategory>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const [itemDelete, setItemDelete] = useState<AttributeCategory>(null);

  const handleCreate = () => {
    dispatch(push(routes.admin.attribute.category.create));
  }

  const handleBack = () => {
    dispatch(push(routes.admin.attribute.root));
  }

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => {
    fetchData({
      page: newPage + 1
    })
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    fetchData({
      take: Number(event.target.value),
      page: 1
    })
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    _onSearch(e.target.value)
  }

  const fetchData = (params?: { take?: number, page?: number, keyword?: string }) => {
    dispatch(setLoading(true))
    AdminAttributeService.getAttributeCategories({
      take: params?.take || data?.meta?.take || 10,
      page: params?.page || data?.meta?.page || 1,
      keyword: params?.keyword ?? keyword
    })
      .then((res) => {
        setData({
          data: res.data,
          meta: res.meta
        })
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const _onSearch = useDebounce((keyword: string) => fetchData({ keyword, page: 1 }), 500)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: AttributeCategory
  ) => {
    setItemAction(item)
    setActionAnchor(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setItemAction(null)
    setActionAnchor(null);
    setLanguageAnchor(null);
  };

  const onCloseLangAction = () => {
    setLanguageAnchor(null);
  }

  const onShowLangAction = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchor(event.currentTarget);
  };

  const onShowConfirm = () => {
    if (!itemAction) return
    setItemDelete(itemAction)
  }

  const onCloseConfirm = () => {
    if (!itemDelete) return
    setItemDelete(null)
    onCloseActionMenu()
  };

  const onDelete = () => {
    if (!itemDelete) return
    onCloseConfirm()
    dispatch(setLoading(true))
    AdminAttributeService.deleteAttributeCategories(itemDelete.id)
      .then(() => {
        fetchData()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const handleLanguageRedirect = (lang?: LangSupport) => {
    if (!itemAction) return
    onRedirectEdit(itemAction, lang)
    onCloseActionMenu();
  }

  const updateStatus = (status: number) => {
    if (!itemAction) return
    onCloseActionMenu()
    dispatch(setLoading(true))
    AdminAttributeService.updateAttributeCategoryStatus(itemAction.id, status)
      .then(() => {
        fetchData()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onRedirectEdit = (item: AttributeCategory, lang?: LangSupport) => {
    dispatch(push({
      pathname: routes.admin.attribute.category.edit.replace(':id', `${item.id}`),
      search: lang && `?lang=${lang.key}`
    }));
  }


  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={6}>
          <Typography component="h2" variant="h6" align="left">
            Attribute Category
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button sx={{ marginRight: 2 }} variant="contained" color="primary" startIcon={<ArrowBackOutlined />} onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreate}>
              Create
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
            <Box display="flex" alignItems="center" m={3}>
              <InputSearch
                placeholder="Search ..."
                value={keyword || ''}
                onChange={onSearch}
              />
            </Box>
            <Table>
              <TableHeader headers={tableHeaders} />
              <TableBody>
                {
                  data?.data?.length ? (
                    data?.data?.map((item, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell component="th">
                            {item.id}
                          </TableCell>
                          <TableCell component="th">
                            <Link onClick={() => onRedirectEdit(item)}>{item.name}</Link>
                          </TableCell>
                          <TableCell component="th">
                            {item?.languages?.map(it => it.language).join(', ')}
                          </TableCell>
                          <TableCell component="th">
                            <StatusChip status={item.status} />
                          </TableCell>
                          <TableCell component="th">
                            <IconButton
                              className={clsx(classes.actionButton, {
                                [classes.actionButtonActive]: item.id === itemAction?.id
                              })}
                              color="primary"
                              onClick={(event) => {
                                handleAction(event, item);
                              }}
                            >
                              <ExpandMoreOutlined />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={keyword} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={data?.meta?.itemCount || 0}
              rowsPerPage={data?.meta?.take || 10}
              page={data?.meta?.page ? data?.meta?.page - 1 : 0}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Menu
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorEl={actionAnchor}
            keepMounted
            open={Boolean(actionAnchor)}
            onClose={onCloseActionMenu}
          >
            <MenuItem
              sx={{ fontSize: '0.875rem' }}
              onClick={onShowLangAction}
            >
              <Box display="flex" alignItems={"center"}>
                <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                <span>Edit Languages</span>
              </Box>
            </MenuItem>
            {itemAction && itemAction?.status !== EStatus.Active && (
              <MenuItem
                sx={{ fontSize: '0.875rem' }}
                onClick={() => updateStatus(EStatus.Active)}
              >
                <Box display="flex" alignItems={"center"}>
                  <Done sx={{ marginRight: '0.25rem' }} color="success" fontSize="small" />
                  <span>Active</span>
                </Box>
              </MenuItem>
            )}
            {itemAction && itemAction?.status !== EStatus.Inactive && (
              <MenuItem
                sx={{ fontSize: '0.875rem' }}
                onClick={() => updateStatus(EStatus.Inactive)}
              >
                <Box display="flex" alignItems={"center"}>
                  <HideSource sx={{ marginRight: '0.25rem' }} color="error" fontSize="small" />
                  <span>Inactive</span>
                </Box>
              </MenuItem>
            )}
            <MenuItem
              sx={{ fontSize: '0.875rem' }}
              onClick={onShowConfirm}
            >
              <Box display="flex" alignItems={"center"}>
                <DeleteOutlineOutlined sx={{ marginRight: '0.25rem' }} color="error" fontSize="small" />
                <span>Delete</span>
              </Box>
            </MenuItem>
          </Menu>
          <Menu
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorEl={languageAnchor}
            keepMounted
            open={Boolean(languageAnchor)}
            onClose={onCloseLangAction}
          >
            <MenuItem
              sx={{ fontSize: '0.875rem' }}
              onClick={() => { handleLanguageRedirect() }}
            >
              <span>Default</span>
            </MenuItem>
            {
              langSupports.map((item, index) => (
                <MenuItem
                  key={index}
                  sx={{ fontSize: '0.875rem' }}
                  onClick={() => { handleLanguageRedirect(item) }}
                >
                  <span>{item.name}</span>
                </MenuItem>
              ))
            }
          </Menu>
          <WarningModal
            title="Confirm"
            isOpen={!!itemDelete}
            onClose={onCloseConfirm}
            onYes={onDelete}
          >
            Are you sure?
          </WarningModal>
        </Grid>
      </Grid>
    </>
  )
})

export default AttributeCategoryList