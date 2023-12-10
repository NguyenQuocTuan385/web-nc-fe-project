import { Add as AddIcon, DeleteOutlineOutlined, Done, EditOutlined, ExpandMoreOutlined, FilterAlt, HideSource } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Link, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import clsx from "clsx";
import FilderModal, { EFilterType, FilterOption, FilterValue } from "components/FilterModal";
import InputSearch from "components/InputSearch";
import WarningModal from "components/Modal/WarningModal";
import SearchNotFound from "components/SearchNotFound";
import StatusChip from "components/StatusChip";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import useDebounce from "hooks/useDebounce";
import { GetPlansParams, Plan } from "models/Admin/plan";
import { DataPagination, EStatus, LangSupport, langSupports, OptionItemT, TableHeaderLabel, SortItem } from "models/general";
import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import AdminPlanService from "services/admin/plan";
import classes from './styles.module.scss';
import { fCurrency2 } from 'utils/formatNumber';
import { Solution } from "models/Admin/solution";
import AdminSolutionService from "services/admin/solution";

const tableHeaders: TableHeaderLabel[] = [
  { name: 'id', label: 'Id', sortable: true },
  { name: 'title', label: 'Name', sortable: true },
  { name: 'solutionId', label: 'Solution', sortable: true },
  { name: 'price', label: 'Price', sortable: true },
  { name: 'languages', label: 'Languages', sortable: false },
  { name: 'status', label: 'Status', sortable: true },
  { name: 'actions', label: 'Actions', sortable: false },
];

const filterOptions: FilterOption[] = [
  { name: 'Solution', key: 'solutionIds', type: EFilterType.SELECT, placeholder: 'Select solutions' },
]

interface Props {
  sort: SortItem,
  setSort: React.Dispatch<React.SetStateAction<SortItem>>,
  keyword: string,
  setKeyword: React.Dispatch<React.SetStateAction<string>>,
  data: DataPagination<Plan>,
  setData: React.Dispatch<React.SetStateAction<DataPagination<Plan>>>,
  filterData: FilterValue,
  setFilterData: React.Dispatch<React.SetStateAction<FilterValue>>,
}

const PlanList = memo(({ sort, setSort, keyword, setKeyword, data, setData, filterData, setFilterData }: Props) => {

  const dispatch = useDispatch()

  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [itemAction, setItemAction] = useState<Plan>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const [itemDelete, setItemDelete] = useState<Plan>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);

  const handleCreate = () => {
    dispatch(push(routes.admin.plan.create));
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

  const fetchData = (value?: { take?: number, page?: number, keyword?: string, filter?: FilterValue, sort?: SortItem }) => {
    const params: GetPlansParams = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword,
      solutionIds: (filterData?.solutionIds as OptionItemT<number>[])?.map(it => it.id),
      sortedField: value?.sort?.sortedField,
      isDescending: value?.sort?.isDescending,
    }
    if (value?.filter !== undefined) {
      params.solutionIds = (value.filter?.solutionIds as OptionItemT<number>[])?.map(it => it.id)
    }
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined
    }
    dispatch(setLoading(true))
    AdminPlanService.getPlans(params)
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
    const fetchOption = () => {
      AdminSolutionService.getSolutions({ take: 999 })
        .then((res) => {
          setSolutions(res.data)
        })
    }
    fetchOption()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: Plan
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
    AdminPlanService.delete(itemDelete.id)
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
    AdminPlanService.updateStatus(itemAction.id, status)
      .then(() => {
        fetchData()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onRedirectEdit = (item: Plan, lang?: LangSupport) => {
    dispatch(push({
      pathname: routes.admin.plan.edit.replace(':id', `${item.id}`),
      search: lang && `?lang=${lang.key}`
    }));
  }

  const onChangeFilter = (value: FilterValue) => {
    setFilterData(value)
    fetchData({ filter: value, page: 1 })
  }

  const getFilterOption = (name: string) => {
    switch (name) {
      case 'solutionIds':
        return solutions?.map(it => ({ id: it.id, name: it.title })) || []
    }
    return []
  }

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={6}>
          <Typography component="h2" variant="h6" align="left">
            Plan
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreate}>
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
                          <TableCell component="th">
                            {item.id}
                          </TableCell>
                          <TableCell component="th">
                            <Link onClick={() => onRedirectEdit(item)}>{item.title}</Link>
                          </TableCell>
                          <TableCell component="th">
                            {item.solution?.title}
                          </TableCell>
                          <TableCell component="th">
                            {fCurrency2(item.price)}
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
    </>
  )
})

export default PlanList