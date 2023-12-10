import { Add, DeleteOutlineOutlined, EditOutlined, ExpandMoreOutlined, Check as CheckIcon, Close, Done, HideSource } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Link, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import clsx from "clsx";
import InputSearch from "components/InputSearch";
import WarningModal from "components/Modal/WarningModal";
import SearchNotFound from "components/SearchNotFound";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import useDebounce from "hooks/useDebounce";
import { Attribute, GetAttributesParams } from "models/Admin/attribute";
import { DataPagination, LangSupport, langSupports, TableHeaderLabel, EStatus, SortItem } from "models/general";
import { memo, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import { AdminAttributeService } from "services/admin/attribute";
import classes from './styles.module.scss';
import StatusChip from "components/StatusChip";

const tableHeaders: TableHeaderLabel[] = [
  { name: 'id', label: 'Id', sortable: true },
  { name: 'code', label: 'Code', sortable: true },
  { name: 'content', label: 'Content', sortable: true },
  { name: 'start', label: 'Start', sortable: true },
  { name: 'end', label: 'End', sortable: true },
  { name: 'typeId', label: 'Type', sortable: true },
  { name: 'solutionId', label: 'Solution', sortable: true },
  { name: 'categoryId', label: 'Category', sortable: true },
  { name: 'contentTypeId', label: 'Content type', sortable: true },
  { name: 'languages', label: 'Languages', sortable: false },
  { name: 'order', label: 'Order', sortable: true },
  { name: 'status', label: 'Status', sortable: true },
  { name: 'actions', label: 'Actions', sortable: false },
];

interface Props {
  sort: SortItem,
  setSort: React.Dispatch<React.SetStateAction<SortItem>>,
  keyword: string,
  setKeyword: React.Dispatch<React.SetStateAction<string>>,
  data: DataPagination<Attribute>,
  setData: React.Dispatch<React.SetStateAction<DataPagination<Attribute>>>
}

const List = memo(({ sort, setSort, keyword, setKeyword, data, setData }: Props) => {

  const dispatch = useDispatch()
  const [itemAction, setItemAction] = useState<Attribute>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const [itemDelete, setItemDelete] = useState<Attribute>(null);

  const handleAdd = () => {
    dispatch(push(routes.admin.attribute.create));
  }

  const handleRedirectToCategory = () => {
    dispatch(push(routes.admin.attribute.category.root));
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

  const fetchData = (value?: { take?: number, page?: number, keyword?: string, sort?: SortItem }) => {
    dispatch(setLoading(true))
    const params: GetAttributesParams = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword,
      sortedField: value?.sort?.sortedField,
      isDescending: value?.sort?.isDescending,
    }
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined
    }
    AdminAttributeService.getAttributes(params)
      .then((res) => {
        setData({ data: res.data, meta: res.meta })
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onChangeSort = (name: string) => {
    let sortItem: SortItem
    if (sort?.sortedField === name) {
      sortItem = {
        ...sort,
        isDescending: !sort.isDescending
      }
    } else {
      sortItem = {
        sortedField: name,
        isDescending: true
      }
    }
    setSort(sortItem)
    fetchData({ sort: sortItem })
  }

  const _onSearch = useDebounce((keyword: string) => fetchData({ keyword, page: 1 }), 500)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: Attribute
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
    dispatch(setLoading(true))
    AdminAttributeService.delete(itemDelete.id)
      .then(() => {
        fetchData()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
    onCloseConfirm()
  }

  const handleLanguageRedirect = (lang?: LangSupport) => {
    if (!itemAction) return
    onRedirectEdit(itemAction, lang)
    onCloseActionMenu();
  }

  const onRedirectEdit = (item: Attribute, lang?: LangSupport) => {
    dispatch(push({
      pathname: routes.admin.attribute.edit.replace(':id', `${item.id}`),
      search: lang && `?lang=${lang.key}`
    }));
  }

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

  const updateStatus = (status: number) => {
    if (!itemAction) return
    onCloseActionMenu()
    dispatch(setLoading(true))
    AdminAttributeService.updateStatus(itemAction.id, status)
      .then(() => {
        fetchData()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={6}>
          <Typography component="h2" variant="h6" align="left">
            Attribute
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button sx={{ marginRight: 2 }} variant="contained" color="primary" onClick={handleRedirectToCategory}>
              Attribute category
            </Button>

            <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd}>
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
              <TableHeader
                headers={tableHeaders}
                sort={sort}
                onChangeSort={onChangeSort}
              />
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
                            {item.code}
                          </TableCell>
                          <TableCell component="th">
                            <Link onClick={() => onRedirectEdit(item)}>{item.content}</Link>
                          </TableCell>
                          <TableCell component="th">
                            <Link onClick={() => onRedirectEdit(item)}>{item.start}</Link>
                          </TableCell>
                          <TableCell component="th">
                            <Link onClick={() => onRedirectEdit(item)}>{item.end}</Link>
                          </TableCell>
                          <TableCell component="th">
                            {item?.type?.name}
                          </TableCell>
                          <TableCell component="th">
                            {item?.solution?.title}
                          </TableCell>
                          <TableCell component="th">
                            {item?.category?.name}
                          </TableCell>
                          <TableCell component="th">
                            {item?.contentType?.name}
                          </TableCell>
                          <TableCell component="th">
                            {item?.languages?.map(it => it.language).join(', ')}
                          </TableCell>
                          <TableCell component="th">
                            {item?.order}
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
                      <TableCell align="center" colSpan={tableHeaders.length}>
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
              page={pageIndex}
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
            {itemAction && itemAction.status !== EStatus.Active && (
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
            {itemAction && itemAction.status !== EStatus.Inactive && (
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
    </div>
  )
})

export default List