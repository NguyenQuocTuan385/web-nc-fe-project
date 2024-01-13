import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Pagination,
  TablePagination
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useResolvedPath,
  createSearchParams
} from "react-router-dom";
import queryString from "query-string";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classes from "./styles.module.scss";

import SideBarWard from "components/admin/SidebarWard";
import TableTemplate from "components/common/TableTemplate";
import InfoLocation from "./components/InfoLocation";
import { Header } from "components/common/Header";
import SearchAppBar from "components/common/Search";
import SearchAppBarAdvertise from "components/common/SearchAdvertise";
import AdvertiseService from "services/advertise";
import { routes } from "routes/routes";
import styled from "styled-components";
import { LocationView } from "models/location";
import { Contract } from "models/contract";
import ContractService from "services/contract";
import { Advertise } from "models/advertise";
import ParagraphBody from "components/common/text/ParagraphBody";
import useIntercepts from "hooks/useIntercepts";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/user";
import { ERole } from "models/general";
import SideBarDCMS from "components/admin/SidebarDCMS";

const ButtonBack = styled(Button)(() => ({
  paddingLeft: "0 !important",
  "&:hover": {
    backgroundColor: "transparent !important"
  }
}));

const IconButtonBack = styled(IconButton)(() => ({
  paddingLeft: "0 !important",
  "&:hover": {
    backgroundColor: "transparent !important"
  }
}));

const AdvertiseOfLocationManagement = () => {
  const navigate = useNavigate();
  const currentUser: User = useSelector(selectCurrentUser);
  const isWard = currentUser.role.id === ERole.WARD ? true : false;
  const isDistrict = currentUser.role.id === ERole.DISTRICT ? true : false;
  const { id } = useParams<{ id: string }>();
  const [advertiseList, setAdvertiseList] = useState([]);
  const [infoContract, setInfoContract] = useState<Contract | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;
  const intercept = useIntercepts();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const closeDeleteDialogHandle = () => {
    setOpenDeleteDialog(false);
  };
  const [adsId, setAdsId] = useState(0);
  const [currentPage, setCurrentPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.page || 1;
  });

  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.rowsNum || 5;
  });
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPageValue: number
  ) => {
    setCurrentPage(newPageValue + 1);
    // navigate({
    //   pathname: match,
    //   search: createSearchParams({
    //     page: newPageValue.toString()
    //   }).toString()
    // });
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await AdvertiseService.getAdvertisesByLocationId(
          Number(id),
          {
            search: searchValue,
            pageSize: Number(rowsPerPage),
            current: Number(currentPage)
          },
          intercept
        );

        const updatedAdvertises: any = await Promise.all(
          res.content.map(async (advertise: Advertise) => {
            let contractData = await ContractService.findContractLicensingByAdvertiseId(
              advertise.id,
              {},
              intercept
            );

            if (!contractData) {
              contractData = null;
            }
            return {
              ...advertise,
              contract: contractData
            };
          })
        );

        setAdvertiseList(updatedAdvertises);
        setTotalPage(res.totalPages);
        setTotalElements(res.totalElements);

        navigate({
          pathname: match,
          search: createSearchParams({
            page: currentPage.toString()
          }).toString()
        });
      } catch (error) {
        // Trường hợp lỗi do không có contract --> Call lại API lấy danh sách advertises
        const res = await AdvertiseService.getAdvertisesByLocationId(
          Number(id),
          {
            search: searchValue,
            pageSize: Number(rowsPerPage),
            current: Number(currentPage)
          },
          intercept
        );

        setAdvertiseList(res.content);
        setTotalPage(res.totalPages);
        setTotalElements(res.totalElements);

        navigate({
          pathname: match,
          search: createSearchParams({
            page: currentPage.toString()
          }).toString()
        });
      }
    })();
  }, [currentPage, searchValue, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const handleViewAdDetails = (idAdvertise: number) => {
    if (isWard) {
      navigate(`${routes.admin.advertises.wardDetails.replace(":id", `${idAdvertise}`)}`);
    } else if (isDistrict) {
      navigate(`${routes.admin.advertises.districtDetails.replace(":id", `${idAdvertise}`)}`);
    } else {
      navigate(`${routes.admin.advertises.dcms.replace(":id", `${idAdvertise}`)}`);
    }
  };

  const handleEditAdvertise = (idAdvertise: number) => {
    if (isWard) {
      navigate(
        `${routes.admin.advertises.wardEdit
          .replace(":locationId", `${id}`)
          .replace(":advertiseId", `${idAdvertise}`)}`
      );
    } else if (isDistrict) {
      navigate(
        `${routes.admin.advertises.districtEdit
          .replace(":locationId", `${id}`)
          .replace(":advertiseId", `${idAdvertise}`)}`
      );
    } else {
      navigate(
        `${routes.admin.advertises.dcmsEdit
          .replace(":locationId", `${id}`)
          .replace(":advertiseId", `${idAdvertise}`)}`
      );
    }
  };

  const handleAddAdvertise = (idAdvertise: number) => {
    console.log(idAdvertise);
  };

  const handleDeleteAdvertise = (idAdvertise: number) => {
    setAdsId(idAdvertise);
    setOpenDeleteDialog(true);
  };

  const deleteAdvertise = (idAdvertise: number) => {
    AdvertiseService.deleteAdvertiseById(idAdvertise, intercept)
      .then((res) => {
        const updatedAdvertises = advertiseList.filter((ads: any) => ads.id !== idAdvertise);
        setAdvertiseList(updatedAdvertises);
        setOpenDeleteDialog(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
  };

  const data = advertiseList.map((ads: any, index: number) => {
    return {
      stt: index + 1,
      id: ads.id,
      adsType: ads.adsType.name,
      adsForm: ads.location.adsForm.name,
      size: ads.width + "m x " + ads.height + "m",
      objectStatus: {
        name: ads.licensing ? "Đã cấp phép" : "Chưa cấp phép",
        value: ads.licensing
      },
      pillarQuantity: !!ads.pillarQuantity ? ads.pillarQuantity : 0,
      statusContract: !!ads.contract ? ads.contract.status : null
    };
  });

  const customHeading = [
    "STT",
    "Loại bảng quảng cáo",
    "Tên loại hình",
    "Kích thước",
    "SL trụ",
    "Trạng thái"
  ];
  const customColumns = [
    "stt",
    "id",
    "adsType",
    "adsForm",
    "size",
    "pillarQuantity",
    "objectStatus"
  ];

  const dataInfoLocation: LocationView = advertiseList.map((ads: any, index: number) => {
    return {
      stt: (Number(currentPage) - 1) * Number(rowsPerPage) + index + 1,
      id: ads.location.id,
      address: ads.location.address,
      adsForm: ads.location.adsForm.name,
      planning: ads.location.planning,
      locationType: ads.location.locationType.name,
      latitude: ads.location.latitude,
      longtitude: ads.location.longitude,
      images: ads.location.images.length > 0 ? JSON.parse(ads.location.images) : []
    };
  })[0];

  const goBack = () => {
    if (isWard) {
      navigate(`${routes.admin.locations.ward}`);
    } else if (isDistrict) {
      navigate(`${routes.admin.locations.district}`);
    } else {
      navigate(`${routes.admin.locations.dcms}`);
    }
  };

  return (
    <>
      {/* <Header /> */}
      <div className={classes["advertise-management-container"]}>
        {currentUser.role.id === ERole.WARD || currentUser.role.id === ERole.DISTRICT ? (
          <SideBarWard>
            <Box className={classes["container-body"]}>
              <ButtonBack onClick={() => goBack()}>
                <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
                Trở về
              </ButtonBack>
              {advertiseList.length > 0 && (
                <Box className={classes["search-container"]}>
                  <SearchAppBar onSearch={handleSearch} />
                </Box>
              )}
              <Box>{dataInfoLocation && <InfoLocation data={dataInfoLocation}></InfoLocation>}</Box>

              {advertiseList.length > 0 && (
                <Box className={classes["table-container"]}>
                  <Box className={classes["table-container"]}>
                    <TableTemplate
                      data={data}
                      customHeading={customHeading}
                      customColumns={customColumns}
                      isActionColumn={true}
                      onViewDetailsClick={handleViewAdDetails}
                      onEditClick={handleEditAdvertise}
                      onAddClick={handleAddAdvertise}
                    />

                    <Box className={classes.pagination}>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component='div'
                        count={totalElements}
                        page={Number(currentPage) - 1}
                        onPageChange={handleChangePage}
                        rowsPerPage={Number(rowsPerPage)}
                        labelRowsPerPage='Số dòng trên mỗi trang' // Thay đổi text ở đây
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Box>

                    {/* <Box className={classes["pagination-custom"]}>
                  <span>{`Hiển thị ${Math.min(
                    Number(currentPage) * itemsPerPage,
                    totalElements
                  )} kết quả trên ${totalElements}`}</span>
                  <Pagination
                    count={totalPage}
                    page={Number(currentPage)}
                    onChange={handleChangePage}
                  />
                </Box> */}
                  </Box>
                </Box>
              )}
              {(advertiseList.length === 0 || !advertiseList) && (
                <ParagraphBody className={classes.noList}>
                  Không có thông tin bảng quảng cáo
                </ParagraphBody>
              )}
            </Box>
          </SideBarWard>
        ) : (
          <SideBarDCMS>
            <Box className={classes["container-body"]}>
              <ButtonBack onClick={() => goBack()}>
                <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
                Trở về
              </ButtonBack>
              {advertiseList.length > 0 && (
                <Box className={classes["search-container"]}>
                  <SearchAppBarAdvertise onSearch={handleSearch} />
                </Box>
              )}
              <Box>{dataInfoLocation && <InfoLocation data={dataInfoLocation}></InfoLocation>}</Box>

              {advertiseList.length > 0 && (
                <Box className={classes["table-container"]}>
                  <Box className={classes["table-container"]}>
                    <TableTemplate
                      data={data}
                      customHeading={customHeading}
                      customColumns={customColumns}
                      isActionColumn={true}
                      onViewDetailsClick={handleViewAdDetails}
                      onEditClick={handleEditAdvertise}
                      onDeleteClick={handleDeleteAdvertise}
                    />

                    <Box className={classes.pagination}>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component='div'
                        count={totalElements}
                        page={Number(currentPage) - 1}
                        onPageChange={handleChangePage}
                        rowsPerPage={Number(rowsPerPage)}
                        labelRowsPerPage='Số dòng trên mỗi trang' // Thay đổi text ở đây
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Box>

                    {/* <Box className={classes["pagination-custom"]}>
                  <span>{`Hiển thị ${Math.min(
                    Number(currentPage) * itemsPerPage,
                    totalElements
                  )} kết quả trên ${totalElements}`}</span>
                  <Pagination
                    count={totalPage}
                    page={Number(currentPage)}
                    onChange={handleChangePage}
                  />
                </Box> */}
                  </Box>
                </Box>
              )}
              {(advertiseList.length === 0 || !advertiseList) && (
                <ParagraphBody className={classes.noList}>
                  Không có thông tin bảng quảng cáo
                </ParagraphBody>
              )}
            </Box>
          </SideBarDCMS>
        )}
      </div>
      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDialogHandle}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Lưu ý"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn có thật sự muốn xóa quảng cáo này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={closeDeleteDialogHandle}>
            Hủy bỏ
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              deleteAdvertise(adsId);
            }}
            autoFocus
            color='success'
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdvertiseOfLocationManagement;
