import { DeleteOutlineOutlined, EditOutlined, ExpandMoreOutlined, FilterAlt } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, Link } from "@mui/material";
import clsx from "clsx";
import FilderModal, { EFilterType, FilterOption, FilterValue } from "components/FilterModal";
import InputSearch from "components/InputSearch";
import LabelStatus from "components/LableStatus";
import ProjectCancelType from "components/ProjectCancelType"
import WarningModal from "components/Modal/WarningModal";
import SearchNotFound from "components/SearchNotFound";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import useDebounce from "hooks/useDebounce";
import _ from "lodash";
import { AdminGetProjects } from "models/Admin/project";
import { Solution } from "models/Admin/solution"
import { DataPagination, OptionItemT, paymentMethods, SortItem, TableHeaderLabel } from "models/general";
import { Project, projectStatus, ProjectStatus } from "models/project";
import moment from "moment";
import { memo, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import { AdminProjectService } from "services/admin/project";
import AdminSolutionService from "services/admin/solution";
import { fCurrency, fCurrencyVND } from "utils/formatNumber";
import classes from './styles.module.scss';
import { ESOLUTION_TYPE } from "models/solution";
import ProjectHelper from "helpers/project"

const tableHeaders: TableHeaderLabel[] = [
  { name: 'id', label: 'Id', sortable: true },
  { name: 'name', label: 'Name', sortable: true },
  { name: 'status', label: 'Status', sortable: true },
  { name: 'cancelPaymentScheduleType', label: 'Cancel Schedule', sortable: true },
  { name: 'user', label: 'User', sortable: false },
  { name: 'solution', label: 'Solution', sortable: false },
  { name: 'orderId', label: 'Order Id', sortable: false },
  { name: 'paymentMethodId', label: 'Payment method', sortable: false },
  { name: 'totalAmount', label: 'Total amount', sortable: false },
  { name: 'createdAt', label: 'Created', sortable: true },
  { name: 'actions', label: 'Actions', sortable: false },
];

const filterOptions: FilterOption[] = [
  { name: 'Solution', key: 'solutionIds', type: EFilterType.SELECT, placeholder: 'Select solutions' },
  { name: 'Status', key: 'statusIds', type: EFilterType.SELECT, placeholder: 'Select status' },
  { name: 'Order ID', key: 'orderIds', type: EFilterType.SELECT, placeholder: 'Select Order Id', creatable: true },
]

interface Props {
  sort: SortItem,
  setSort: React.Dispatch<React.SetStateAction<SortItem>>,
  keyword: string,
  setKeyword: React.Dispatch<React.SetStateAction<string>>,
  data: DataPagination<Project>,
  setData: React.Dispatch<React.SetStateAction<DataPagination<Project>>>,
  filterData: FilterValue,
  setFilterData: React.Dispatch<React.SetStateAction<FilterValue>>,
}

const List = memo(({ sort, setSort, keyword, setKeyword, data, setData, filterData, setFilterData }: Props) => {

  const dispatch = useDispatch()

  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);

  const [itemAction, setItemAction] = useState<Project>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [itemDelete, setItemDelete] = useState<Project>(null);

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
    const params: AdminGetProjects = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      sortedField: sort?.sortedField,
      isDescending: sort?.isDescending,
      keyword: keyword,
      solutionIds: (filterData?.solutionIds as OptionItemT<number>[])?.map(it => it.id),
      statusIds: (filterData?.statusIds as OptionItemT<number>[])?.map(it => it.id),
      orderIds: (filterData?.orderIds as OptionItemT<number>[])?.map(it => it.id),
    }
    if (value?.filter !== undefined) {
      params.solutionIds = (value.filter?.solutionIds as OptionItemT<number>[])?.map(it => it.id)
      params.statusIds = (value.filter?.statusIds as OptionItemT<number>[])?.map(it => it.id)
      params.orderIds = (value.filter?.orderIds as OptionItemT<number>[])?.map(it => it.id)
    }
    if (value?.sort !== undefined) {
      params.sortedField = value?.sort?.sortedField
      params.isDescending = value?.sort?.isDescending
    }
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined
    }
    dispatch(setLoading(true))
    AdminProjectService.getProjects(params)
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
      AdminSolutionService.getSolutions({ take: 999 })
        .then((res) => {
          setSolutions(res.data)
        })
    }
    fetchOption()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: Project
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
    AdminProjectService.delete(itemDelete.id)
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

  const onRedirectEdit = (item: Project) => {
    dispatch(push(routes.admin.project.edit.replace(':id', `${item.id}`)));
  }

  const onRedirectDetail = (item: Project) => {
    dispatch(push(routes.admin.project.detail.replace(':id', `${item.id}`)));
  }

  const onRedirectUserDetail = (item: Project) => {
    if (!item.user) return
    dispatch(push(routes.admin.user.edit.replace(':id', `${item.user.id}`)));
  }

  const onChangeFilter = (value: FilterValue) => {
    setFilterData(value)
    fetchData({ filter: value, page: 1 })
  }

  const getFilterOption = (name: string) => {
    switch (name) {
      case 'solutionIds':
        return solutions?.map(it => ({ id: it.id, name: it.title })) || []
      case 'statusIds':
        return _.cloneDeep(projectStatus)
      case 'orderIds':
        return []
    }
    return []
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
        <Grid item xs={12}>
          <Typography component="h2" variant="h6" align="left">
            Projects
          </Typography>
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
                            <Link onClick={() => onRedirectDetail(item)}>{item.name}</Link>
                          </TableCell>
                          <TableCell component="th">
                            <LabelStatus typeStatus={item.status} solutionTypeId={item.solution.typeId} />
                          </TableCell>
                          <TableCell component="th">
                            {
                              ProjectHelper.checkSolutionType(item, [ESOLUTION_TYPE.BRAND_TRACKING], true) && (
                                <ProjectCancelType type={item.cancelPaymentScheduleType} />
                              )
                            }
                          </TableCell>
                          <TableCell component="th">
                            {item.user && <Link onClick={() => onRedirectUserDetail(item)}>{item.user.fullName}</Link>}
                          </TableCell>
                          <TableCell>{item.solution?.title}</TableCell>
                          <TableCell>{!!item.payments?.length && item.payments[0].orderId}</TableCell>
                          <TableCell>{!!item.payments?.length && paymentMethods.find(it => it.id === item.payments[0].paymentMethodId)?.name}</TableCell>
                          <TableCell>
                            {!!item.payments?.length && (
                              <>
                                <p className="cimigo-blue">{fCurrency(item.payments[0].totalAmountUSD || 0)}</p>
                                <p className="cimigo-blue">(Equivalent to {fCurrencyVND(item.payments[0].totalAmount || 0)})</p>
                              </>
                            )}
                          </TableCell>
                          <TableCell component="th">
                            {moment(item.createdAt).format('DD-MM-yyyy HH:ss')}
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
            {
              ProjectHelper.checkSolutionType(itemAction, [ESOLUTION_TYPE.BRAND_TRACKING], false) && (
                <MenuItem
                  sx={{ fontSize: '0.875rem' }}
                  onClick={onEdit}
                >
                  <Box display="flex" alignItems={"center"}>
                    <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                    <span>Edit</span>
                  </Box>
                </MenuItem>
              )
            }
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