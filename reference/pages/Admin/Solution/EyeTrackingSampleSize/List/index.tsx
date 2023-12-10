import { Add, ArrowBackOutlined, DeleteOutlineOutlined, EditOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import clsx from "clsx";
import WarningModal from "components/Modal/WarningModal";
import SearchNotFound from "components/SearchNotFound";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import { EyeTrackingSampleSize, GetListEyeTrackingSampleSize } from "models/Admin/eye_tracking_sample_size";
import { DataPagination, TableHeaderLabel } from "models/general";
import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import { AdminEyeTrackingSampleSizeService } from "services/admin/eye_tracking_sample_size";
import classes from './styles.module.scss';

const tableHeaders: TableHeaderLabel[] = [
  { name: 'id', label: 'Id', sortable: false },
  { name: 'limit', label: 'Limit', sortable: false },
  { name: 'price', label: 'Price', sortable: false },
  { name: 'actions', label: 'Actions', sortable: false },
];

interface Props {
}

const EyeTrackingSampleSizeList = memo(({ }: Props) => {

  const { solutionId } = useParams<{ solutionId: string }>();
  const dispatch = useDispatch()
  const [data, setData] = useState<DataPagination<EyeTrackingSampleSize>>();
  const [itemAction, setItemAction] = useState<EyeTrackingSampleSize>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [itemDelete, setItemDelete] = useState<EyeTrackingSampleSize>(null);

  const handleAdd = () => {
    dispatch(push(routes.admin.solution.eyeTrackingSampleSize.create.replace(":solutionId", solutionId)));
  }

  const handleBack = () => {
    dispatch(push(routes.admin.solution.edit.replace(":id", solutionId)));
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

  const fetchData = (value?: { take?: number, page?: number, keyword?: string }) => {
    dispatch(setLoading(true))
    const params: GetListEyeTrackingSampleSize = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      solutionId: Number(solutionId)
    }
   
    AdminEyeTrackingSampleSizeService.getList(params)
      .then((res) => {
        setData({ data: res.data, meta: res.meta })
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: EyeTrackingSampleSize
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
    AdminEyeTrackingSampleSizeService.delete(itemDelete.id)
      .then(() => {
        fetchData()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
    onCloseConfirm()
  }

  const onRedirectEdit = () => {
    if (!itemAction) return
    dispatch(push(routes.admin.solution.eyeTrackingSampleSize.edit.replace(':solutionId', `${solutionId}`).replace(':sampleSizeId', `${itemAction.id}`)));
  }

  return (
    <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={6}>
          <Typography component="h2" variant="h6" align="left">
            Eye Tracking Sample Size
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button sx={{marginRight: 2}} variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd}>
              Create
            </Button>
            <Button variant="contained" color="primary" startIcon={<ArrowBackOutlined />} onClick={handleBack}>
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
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
                            {`< `}{item.limit}
                          </TableCell>
                          <TableCell component="th">
                            {item.price}
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
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound />
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
              onClick={onRedirectEdit}
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

export default EyeTrackingSampleSizeList