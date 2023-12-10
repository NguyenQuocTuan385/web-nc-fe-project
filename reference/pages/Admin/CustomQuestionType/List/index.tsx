import { EditOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { Box, Grid, IconButton, Link, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import clsx from "clsx";
import InputSearch from "components/InputSearch";
import SearchNotFound from "components/SearchNotFound";
import StatusChip from "components/StatusChip";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import useDebounce from "hooks/useDebounce";
import { CustomQuestionType, AdminGetCustomQuestionTypes } from "models/Admin/custom_question_type";
import { DataPagination, LangSupport, langSupports, TableHeaderLabel } from "models/general";
import { memo, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import { AdminCustomQuestionTypeService } from "services/admin/custom_question_type";
import { fCurrencyVND } from "utils/formatNumber";
import classes from './styles.module.scss';

const tableHeaders: TableHeaderLabel[] = [
  { name: 'order', label: 'Order', sortable: false },
  { name: 'id', label: 'Id', sortable: false },
  { name: 'title', label: 'Title', sortable: false },
  { name: 'price', label: 'Price', sortable: false },
  { name: 'priceAttribute', label: 'Attribute price', sortable: false },
  { name: 'minAnswer', label: 'Min answer', sortable: false },
  { name: 'maxAnswer', label: 'Max answer', sortable: false },
  { name: 'maxAttribute', label: 'Max attribute', sortable: false },
  { name: 'languages', label: 'Languages', sortable: false },
  { name: 'status', label: 'Status', sortable: false },
  { name: 'actions', label: 'Actions', sortable: false },
];

interface Props {
  keyword: string,
  setKeyword: React.Dispatch<React.SetStateAction<string>>,
  data: DataPagination<CustomQuestionType>,
  setData: React.Dispatch<React.SetStateAction<DataPagination<CustomQuestionType>>>
}

const List = memo(({ keyword, setKeyword, data, setData }: Props) => {

  const dispatch = useDispatch()
  const [itemAction, setItemAction] = useState<CustomQuestionType>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);

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
    const params: AdminGetCustomQuestionTypes = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword
    }
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined
    }
    AdminCustomQuestionTypeService.getCustomQuestionTypes(params)
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
    item: CustomQuestionType
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

  const handleLanguageRedirect = (lang?: LangSupport) => {
    if (!itemAction) return
    onRedirectEdit(itemAction, lang)
    onCloseActionMenu();
  }

  const onRedirectEdit = (item: CustomQuestionType, lang?: LangSupport) => {
    dispatch(push({
      pathname: routes.admin.customQuestionType.edit.replace(':id', `${item.id}`),
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

  return (
    <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={6}>
          <Typography component="h2" variant="h6" align="left">
            Custom question types
          </Typography>
        </Grid>
        <Grid item xs={6}>
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
                          <TableCell>
                            {item.order}
                          </TableCell>
                          <TableCell>
                            {item.id}
                          </TableCell>
                          <TableCell>
                            <Link onClick={() => onRedirectEdit(item)}>{item.title}</Link>
                          </TableCell>
                          <TableCell>
                            {fCurrencyVND(item.price)}
                          </TableCell>
                          <TableCell>
                            {fCurrencyVND(item.priceAttribute)}
                          </TableCell>
                          <TableCell>
                            {item.minAnswer}
                          </TableCell>
                          <TableCell>
                            {item.maxAnswer}
                          </TableCell>
                          <TableCell>
                            {item.maxAttribute}
                          </TableCell>
                          <TableCell>
                            {item?.languages?.map(it => it.language).join(', ')}
                          </TableCell>
                          <TableCell>
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
        </Grid>
      </Grid>
    </div>
  )
})

export default List