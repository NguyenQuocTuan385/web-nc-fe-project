import SideBarWard from "components/admin/SidebarWard";
import React, { useEffect, useState } from "react";
import DetailCard from "./Components/ContractDetailCard";
import images from "config/images";
import ContractService from "services/contract";
import { Contract } from "models/contract";
import { Box, Card, Divider } from "@mui/material";
import classes from "./styles.module.scss";
import Heading6 from "components/common/text/Heading6";
import ShowContractImage from "./Components/ContractImageShow";
import ContractDetailStickyFooter from "./Components/ContractDetailStickyFooter";
import { useParams } from "react-router-dom";

interface dataListObjectItem {
  imageIcon: any;
  title: string;
  content: string;
}

function ContractDetail() {
  const { id } = useParams<{ id: string }>();

  const [contractData, setContractData] = useState<Contract>();
  const [companyDataList, setCompanyDataList] = useState<dataListObjectItem[]>([]);
  const [advertiseDataList, setAdvertiseDataList] = useState<dataListObjectItem[]>([]);

  useEffect(() => {
    ContractService.getContractById(Number(id))
      .then((res) => {
        setContractData(res);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
    setCompanyDataList([
      { imageIcon: images.companyName, title: "Tên công ty", content: String(contractData?.companyName) },
      { imageIcon: images.compamyEmail, title: "Email", content: String(contractData?.companyEmail) },
      { imageIcon: images.companyPhone, title: "Số điện thoại", content: String(contractData?.companyPhone) },
      { imageIcon: images.companyAddress, title: "Địa chỉ", content: String(contractData?.companyAddress) }
    ]);

    setAdvertiseDataList([
      {
        imageIcon: images.sizeIcon,
        title: "Kích thước",
        content: `${contractData?.advertise.width}m x ${contractData?.advertise.height}m`
      },
      {
        imageIcon: images.quantityIcon,
        title: "Số lượng",
        content: `${contractData?.advertise.pillarQuantity} Trụ / Bảng`
      },
      {
        imageIcon: images.categoryIcon,
        title: "Hình thức",
        content: String(contractData?.advertise.location.adsForm.name)
      },
      {
        imageIcon: images.sortIcon,
        title: "Phân loại",
        content: String(contractData?.advertise.location.locationType.name)
      }
    ]);
  }, [contractData]);

  return (
    <div>
      <SideBarWard />

      <Card className={classes.rightComponent}>
        <Box className={classes.detailGroup}>
          <Heading6 id='general' fontSize={"20px"} fontWeight={500}>
            {contractData?.advertise.adsType.name}
          </Heading6>
          <Heading6 fontWeight={50}>{contractData?.advertise.location.address}</Heading6>
        </Box>

        <Divider className={classes.divider} variant='middle' />
        <DetailCard heading='Thông tin chi tiết bảng quảng cáo' data={advertiseDataList} />

        <Divider className={classes.divider} variant='middle' />
        <DetailCard heading='Thông tin về công ty' data={companyDataList} />

        <Divider className={classes.divider} variant='middle' />
        <ShowContractImage imageSrc={String(contractData?.images)} />
        <ContractDetailStickyFooter
          startDate={contractData?.startAt}
          endDate={contractData?.endAt}
          status={contractData?.status}
          deleteId={Number(id)}
        />
      </Card>
    </div>
  );
}

export default ContractDetail;
