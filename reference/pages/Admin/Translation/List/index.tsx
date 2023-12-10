import { DeleteOutlineOutlined, EditOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { Box, Grid, IconButton, Link, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import clsx from "clsx";
import InputSearch from "components/InputSearch";
import WarningModal from "components/Modal/WarningModal";
import SearchNotFound from "components/SearchNotFound";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import useDebounce from "hooks/useDebounce";
import { GetTranslations, Translation } from "models/Admin/translation";
import { DataPagination, TableHeaderLabel } from "models/general";
import { memo, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import { TranslationService } from "services/admin/translation";
import classes from './styles.module.scss';

const tableHeaders: TableHeaderLabel[] = [
  { name: 'id', label: 'Id', sortable: false },
  { name: 'key', label: 'Key', sortable: false },
  { name: 'data', label: 'Text', sortable: false },
  { name: 'language', label: 'Language', sortable: false },
  { name: 'actions', label: 'Actions', sortable: false },
];

interface Props {
  keyword: string,
  setKeyword: React.Dispatch<React.SetStateAction<string>>,
  data: DataPagination<Translation>,
  setData: React.Dispatch<React.SetStateAction<DataPagination<Translation>>>
}

const List = memo(({ keyword, setKeyword, data, setData }: Props) => {

  const dispatch = useDispatch()
  const [itemAction, setItemAction] = useState<Translation>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [itemDelete, setItemDelete] = useState<Translation>(null);

  // const handleAdd = () => {
  //   dispatch(push(routes.admin.translation.create));
  // }

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

  const fetchData = (value?: { take?: number, page?: number, keyword?: string }) => {
    dispatch(setLoading(true))
    const params: GetTranslations = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword
    }
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined
    }
    TranslationService.getTranslations(params)
      .then((res) => {
        setData({ data: res.data, meta: res.meta })
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
    item: Translation
  ) => {
    setItemAction(item)
    setActionAnchor(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setItemAction(null)
    setActionAnchor(null);
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
    TranslationService.delete(itemDelete.id)
      .then(() => {
        fetchData()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
    onCloseConfirm()
  }

  const handleEdit = () => {
    if (!itemAction) return
    onRedirectEdit(itemAction)
    onCloseActionMenu();
  }

  const onRedirectEdit = (item: Translation) => {
    dispatch(push(routes.admin.translation.edit.replace(':id', `${item.id}`)));
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

  return (
    <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={6}>
          <Typography component="h2" variant="h6" align="left">
            Translation
          </Typography>
        </Grid>
        <Grid item xs={6}>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd}>
              Create
            </Button>
          </Box> */}
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
                            <Link onClick={() => onRedirectEdit(item)}>{item.key}</Link>
                          </TableCell>
                          <TableCell component="th">
                            {item.data}
                          </TableCell>
                          <TableCell component="th">
                            {item.language}
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
              onClick={handleEdit}
            >
              <Box display="flex" alignItems={"center"}>
                <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                <span>Edit</span>
              </Box>
            </MenuItem>
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