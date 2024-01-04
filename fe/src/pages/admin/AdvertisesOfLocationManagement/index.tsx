import { Box, Button, IconButton, Pagination } from "@mui/material";
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
import AdvertiseService from "services/advertise";
import { routes } from "routes/routes";
import styled from "styled-components";
import { LocationView } from "models/location";
import { Contract } from "models/contract";
import ContractService from "services/contract";
import { Advertise } from "models/advertise";

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
  const { id } = useParams<{ id: string }>();
  const itemsPerPage = 5;
  const [advertiseList, setAdvertiseList] = useState([]);
  const [infoContract, setInfoContract] = useState<Contract | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;

  const [currentPage, setCurrentPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.page || 1;
  });

  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPageValue: number) => {
    setCurrentPage(newPageValue);
    navigate({
      pathname: match,
      search: createSearchParams({
        page: newPageValue.toString()
      }).toString()
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await AdvertiseService.getAdvertisesByLocationId(Number(id), {
          search: searchValue,
          pageSize: itemsPerPage,
          current: Number(currentPage)
        });

        const updatedAdvertises: any = await Promise.all(
          res.content.map(async (advertise: Advertise) => {
            const contractData = await ContractService.getContractsByAdvertiseOne(advertise.id, {});
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
        console.log(error);
      }
    })();
  }, [currentPage, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const handleViewAdDetails = (idAdvertise: number) => {
    navigate(`${routes.admin.advertises.details.replace(":id", `${idAdvertise}`)}`);
  };

  const handleEditAdvertise = (idAdvertise: number) => {
    navigate(
      `${routes.admin.advertises.edit
        .replace(":locationId", `${id}`)
        .replace(":advertiseId", `${idAdvertise}`)}`
    );
  };

  const handleAddAdvertise = (idAdvertise: number) => {
    console.log(idAdvertise);
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
      pillarQuantity: ads.pillarQuantity,
      statusContract: ads.contract.status
    };
  });

  const customHeading = [
    "STT",
    "Mã",
    "Loại bảng quảng cáo",
    "Tên loại hình",
    "Kích thước",
    "Số lượng trụ",
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
      stt: index,
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
    navigate(`${routes.admin.locations.root}`);
  };

  return (
    <Box>
      <Header />
      <div className={classes["advertise-management-container"]}>
        <SideBarWard></SideBarWard>
        <Box className={classes["container-body"]}>
          <ButtonBack onClick={() => goBack()}>
            <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
            Trở về
          </ButtonBack>
          <Box className={classes["search-container"]}>
            <SearchAppBar onSearch={handleSearch} />
          </Box>
          <Box>{dataInfoLocation && <InfoLocation data={dataInfoLocation}></InfoLocation>}</Box>

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

              <Box className={classes["pagination-custom"]}>
                <span>{`Hiển thị ${Math.min(
                  Number(currentPage) * itemsPerPage,
                  totalElements
                )} kết quả trên ${totalElements}`}</span>
                <Pagination
                  count={totalPage}
                  page={Number(currentPage)}
                  onChange={handleChangePage}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default AdvertiseOfLocationManagement;
