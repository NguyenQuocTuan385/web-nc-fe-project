import {
  DeleteOutlineOutlined,
  EditOutlined,
  ExpandMoreOutlined,
  FilterAlt,
} from "@mui/icons-material";
import {
  Button,
  Box,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import InputSearch from "components/InputSearch";
import SearchNotFound from "components/SearchNotFound";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import useDebounce from "hooks/useDebounce";
import {
  DataPagination,
  OptionItemT,
  SortItem,
  TableHeaderLabel,
} from "models/general";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import classes from "./styles.module.scss";
import AddIcon from "@mui/icons-material/Add";
import WarningModal from "components/Modal/WarningModal";
import { AdminWebHookService } from "services/admin/webhook";
import { GetWebHooksParams, Webhook, eventWebhooks } from 'models/Admin/webhook';
import FilderModal, { EFilterType, FilterOption, FilterValue } from "components/FilterModal";


const filterOptions: FilterOption[] = [
  {
    name: "Event",
    key: "eventIds",
    type: EFilterType.SELECT,
    placeholder: "Select Event",
  },
];

interface Props {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  data: DataPagination<Webhook>;
  setData: React.Dispatch<
    React.SetStateAction<DataPagination<Webhook>>
  >;
  filterData: FilterValue;
  setFilterData: React.Dispatch<React.SetStateAction<FilterValue>>;
}

const List = memo(
  ({
    keyword,
    setKeyword,
    data,
    setData,
    filterData,
    setFilterData
  }: Props) => {
    const dispatch = useDispatch();
    const [itemAction, setItemAction] = useState<Webhook>();

    const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
    const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
    const [itemDelete, setItemDelete] = useState<Webhook>(null);

    const tableHeaders: TableHeaderLabel[] = useMemo(() => {
      var data = [
        { name: "id", label: "Id", sortable: false },
        { name: "url", label: "Url", sortable: false },
        { name: "event", label: "Event", sortable: false },
        { name: "description", label: "Description", sortable: false },
        { name: "actions", label: "Actions", sortable: false },
      ]
      return data
    }, []);

    const handleCreate = () => {
      dispatch(push(routes.admin.webhook.create));
    };

    const handleChangePage = (
      _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      newPage: number
    ) => {
      fetchData({
        page: newPage + 1,
      });
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      fetchData({
        take: Number(event.target.value),
        page: 1,
      });
    };

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
      _onSearch(e.target.value);
    };

    const fetchData = (value?: {
      take?: number,
      page?: number,
      keyword?: string,
      sort?: SortItem,
      filter?: FilterValue
    }) => {
      dispatch(setLoading(true));
      const params: GetWebHooksParams = {
        take: value?.take || data?.meta?.take || 10,
        page: value?.page || data?.meta?.page || 1,
        isDescending: value?.sort?.isDescending,
        keyword: keyword,
        eventIds: (filterData?.eventIds as OptionItemT<number>[])?.map((it) => it.id)
      };
      if (value?.filter !== undefined) {
        params.eventIds = (value.filter?.eventIds as OptionItemT<number>[])?.map(
          (it) => it.id
        );
      }
      if (value?.keyword !== undefined) {
        params.keyword = value.keyword || undefined;
      }

      dispatch(setLoading(true));

      AdminWebHookService.getWebhooks(params)
        .then((res) => {
          setData({ data: res.data, meta: res.meta });
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    };

    const onChangeFilter = (value: FilterValue) => {
      setFilterData(value);
      fetchData({ filter: value, page: 1 });
    };

    const _onSearch = useDebounce(
      (keyword: string) => fetchData({ keyword, page: 1 }),
      500
    );

    useEffect(() => {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAction = (
      event: React.MouseEvent<HTMLButtonElement>,
      item: Webhook
    ) => {
      setItemAction(item);
      setActionAnchor(event.currentTarget);
    };

    const onCloseActionMenu = () => {
      setItemAction(null);
      setActionAnchor(null);
    };

    const handleEdit = () => {
      if (!itemAction) return;
      onRedirectEdit(itemAction);
      onCloseActionMenu();
    };

    const onShowConfirm = () => {
      if (!itemAction) return;
      setItemDelete(itemAction);
    };

    const onCloseConfirm = () => {
      if (!itemDelete) return;
      setItemDelete(null);
      onCloseActionMenu();
    };

    const onDelete = () => {
      if (!itemDelete) return;
      onCloseConfirm();
      dispatch(setLoading(true));
      AdminWebHookService.delete(itemDelete.id)
        .then(() => {
          fetchData();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    };

    const getFilterOption = (name: string) => {
      switch (name) {
        case "eventIds":
          return eventWebhooks || [];
      }
      return [];
    };

    const onRedirectEdit = (item: Webhook) => {
      dispatch(push(routes.admin.webhook.edit.replace(":id", `${item.id}`)));
    };

    return (
      <div>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={6}>
            <Typography component="h2" variant="h6" align="left">
              WebHooks
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreate}
              >
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                m={3}
              >
                <InputSearch
                  placeholder="Search url"
                  value={keyword || ""}
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
                <TableHeader headers={tableHeaders} />
                <TableBody>
                  {data?.data?.length ? (
                    data?.data?.map((item, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={index}>
                          <TableCell component="th">{item.id}</TableCell>
                          <TableCell component="th">
                            <Link
                              onClick={() => onRedirectEdit(item)}
                              component="button"
                            >
                              {item.url}
                            </Link>
                          </TableCell>
                          <TableCell component="th">{eventWebhooks.find(it => it.id === item.eventId).name}</TableCell>
                          <TableCell component="th">{item.description}</TableCell>
                          <TableCell component="th">
                            <IconButton
                              className={clsx(classes.actionButton, {
                                [classes.actionButtonActive]:
                                  item.id === itemAction?.id,
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
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={tableHeaders.length}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={keyword} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
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
                vertical: "top",
                horizontal: "right",
              }}
              anchorEl={actionAnchor}
              keepMounted
              open={Boolean(actionAnchor)}
              onClose={onCloseActionMenu}
            >
              <MenuItem sx={{ fontSize: "0.875rem" }} onClick={handleEdit}>
                <Box display="flex" alignItems={"center"}>
                  <EditOutlined
                    sx={{ marginRight: "0.25rem" }}
                    fontSize="small"
                  />
                  <span>Edit</span>
                </Box>
              </MenuItem>
              <MenuItem sx={{ fontSize: "0.875rem" }} onClick={onShowConfirm}>
                <Box display="flex" alignItems={"center"}>
                  <DeleteOutlineOutlined
                    sx={{ marginRight: "0.25rem" }}
                    color="error"
                    fontSize="small"
                  />
                  <span>Delete</span>
                </Box>
              </MenuItem>
            </Menu>
            <FilderModal
              isOpen={isOpenFilter}
              filterOptions={filterOptions}
              filterValue={filterData}
              bindLabel={"name"}
              onChange={onChangeFilter}
              onClose={() => setIsOpenFilter(false)}
              getFilterOption={getFilterOption}
            />
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
    );
  }
);

export default List;
