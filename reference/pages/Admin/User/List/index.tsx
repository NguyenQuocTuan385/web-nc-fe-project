import { Add, DeleteOutlineOutlined, EditOutlined, ExpandMoreOutlined, Check as CheckIcon, FilterAlt, Restore } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, Link, Avatar } from "@mui/material";
import clsx from "clsx";
import FilderModal, { EFilterType, FilterOption, FilterValue } from "components/FilterModal";
import InputSearch from "components/InputSearch";
import WarningModal from "components/Modal/WarningModal";
import SearchNotFound from "components/SearchNotFound";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import useDebounce from "hooks/useDebounce";
import _ from "lodash";
import { GetUsersParams } from "models/Admin/user";
import { DataPagination, OptionItem, OptionItemT, SortItem, TableHeaderLabel } from "models/general";
import { User } from "models/user";
import { memo, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import AdminUserService from "services/admin/user";
import CountryService from "services/country";
import classes from './styles.module.scss';

const tableHeaders: TableHeaderLabel[] = [
  { name: 'id', label: 'Id', sortable: true },
  { name: 'avatar', label: 'Avatar', sortable: true },
  { name: 'firstName', label: 'First Name', sortable: true },
  { name: 'lastName', label: 'Last Name', sortable: true },
  { name: 'email', label: 'Email', sortable: true },
  { name: 'country', label: 'Country', sortable: false },
  { name: 'company', label: 'Company', sortable: true },
  { name: 'deletedAt', label: 'Deleted', sortable: false },
  { name: 'actions', label: 'Actions', sortable: false },
];

const filterOptions: FilterOption[] = [
  { name: 'Country', key: 'countryIds', type: EFilterType.SELECT, placeholder: 'Select country' },
]

interface Props {
  keyword: string,
  setKeyword: React.Dispatch<React.SetStateAction<string>>,
  data: DataPagination<User>,
  setData: React.Dispatch<React.SetStateAction<DataPagination<User>>>,
  filterData: FilterValue,
  setFilterData: React.Dispatch<React.SetStateAction<FilterValue>>,
}

const List = memo(({ keyword, setKeyword, data, setData, filterData, setFilterData }: Props) => {

  const dispatch = useDispatch()

  const [sort, setSort] = useState<SortItem>();

  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [countries, setCountries] = useState<OptionItem[]>([]);

  const [itemAction, setItemAction] = useState<User>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [itemDelete, setItemDelete] = useState<User>(null);

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

  const fetchData = (value?: {
    take?: number,
    page?: number,
    keyword?: string,
    sort?: SortItem,
    filter?: FilterValue
  }) => {
    const params: GetUsersParams = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      sortedField: sort?.sortedField,
      isDescending: sort?.isDescending,
      keyword: keyword,
      countryIds: (filterData?.countryIds as OptionItemT<number>[])?.map(it => it.id),
    }
    if (value?.filter !== undefined) {
      params.countryIds = (value.filter?.countryIds as OptionItemT<number>[])?.map(it => it.id)
    }
    if (value?.sort !== undefined) {
      params.sortedField = value?.sort?.sortedField
      params.isDescending = value?.sort?.isDescending
    }
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined
    }
    dispatch(setLoading(true))
    AdminUserService.getUsers(params)
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

  useEffect(() => {
    fetchData()
    const fetchOption = () => {
      CountryService.getCountries({ take: 999 })
        .then((res) => {
          setCountries(res.data)
        })
    }
    fetchOption()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: User
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
    AdminUserService.delete(itemDelete.id)
      .then(() => {
        fetchData()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
    onCloseConfirm()
  }

  const onEdit = () => {
    if (!itemAction) return
    onRedirectEdit(itemAction)
    onCloseActionMenu()
  }

  const onRedirectEdit = (item: User) => {
    dispatch(push(routes.admin.user.edit.replace(':id', `${item.id}`)));
  }

  const onChangeFilter = (value: FilterValue) => {
    setFilterData(value)
    fetchData({ filter: value, page: 1 })
  }

  const getFilterOption = (name: string) => {
    switch (name) {
      case 'countryIds':
        return countries || []
    }
    return []
  }

  const handleAdd = () => {
    dispatch(push(routes.admin.user.create));
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

  const onRestore = () => {
    dispatch(setLoading(true))
    if (!itemAction) return;
    AdminUserService.restore(itemAction.id)
      .then(() => {
        fetchData()
        onCloseActionMenu()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={6}>
          <Typography component="h2" variant="h6" align="left">
            Users
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd}>
              Create
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" m={3}>
              <InputSearch
                placeholder="Search ..."
                value={keyword || ''}
                onChange={onSearch}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsOpenFilter(true)}
                startIcon={<FilterAlt />}
              >
                Filter
              </Button>
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
                          <TableCell>
                            {item.id}
                          </TableCell>
                          <TableCell>
                            {item.avatar && <Avatar alt={item.firstName} src={item.avatar} imgProps={{referrerPolicy: 'no-referrer'}}/>}
                          </TableCell>
                          <TableCell>
                            <Link onClick={() => onRedirectEdit(item)} component="button">{item.firstName}</Link>
                          </TableCell>
                          <TableCell>
                            <Link onClick={() => onRedirectEdit(item)} component="button">{item.lastName}</Link>
                          </TableCell>
                          <TableCell>
                            {item.email}
                          </TableCell>
                          <TableCell>
                            {item.country?.name}
                          </TableCell>
                          <TableCell>
                            {item.company}
                          </TableCell>
                          <TableCell sx={{ color: 'var(--cimigo-danger)', textAlign: 'center' }}>
                            {!!item.deletedAt && <CheckIcon />}
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
                      <TableCell align="center" colSpan={8}>
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
              onClick={onEdit}
            >
              <Box display="flex" alignItems={"center"}>
                <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                <span>Edit</span>
              </Box>
            </MenuItem>
            {
              !itemAction?.deletedAt && (
                <MenuItem
                  sx={{ fontSize: '0.875rem' }}
                  onClick={onShowConfirm}
                >
                  <Box display="flex" alignItems={"center"}>
                    <DeleteOutlineOutlined sx={{ marginRight: '0.25rem' }} color="error" fontSize="small" />
                    <span>Delete</span>
                  </Box>
                </MenuItem>
              )
            }
            {
              !!itemAction?.deletedAt && (
                <MenuItem
                  sx={{ fontSize: '0.875rem' }}
                  onClick={onRestore}
                >
                  <Box display="flex" alignItems={"center"}>
                    <Restore sx={{ marginRight: '0.25rem' }} fontSize="small" />
                    <span>Restore</span>
                  </Box>
                </MenuItem>
              )
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
          <FilderModal
            isOpen={isOpenFilter}
            filterOptions={filterOptions}
            filterValue={filterData}
            onChange={onChangeFilter}
            onClose={() => setIsOpenFilter(false)}
            getFilterOption={getFilterOption}
          />
        </Grid>
      </Grid>
    </div>
  )
})

export default List