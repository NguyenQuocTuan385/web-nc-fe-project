import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import AdDetails from "./components/AdvertiseDetails";
import ContractDetailForm from "pages/admin/CreateContractForm/components/ContractDetailForm";
import SideBarWard from "components/admin/SidebarWard";
import { Advertise } from "models/advertise";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdvertiseService from "services/advertise";

function ContractForm() {
  const { id } = useParams<{ id: string }>();
  const [advertise, setAdvertise] = useState<Advertise>();

  useEffect(() => {
    AdvertiseService.getAdvertiseById(Number(id))
      .then((res) => {
        setAdvertise(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Box className={classes.pageContainer}>
      <SideBarWard />
      <Box style={{ marginLeft: "320px" }}>
        <AdDetails
          address={advertise?.location.address}
          adType={advertise?.adsType.name}
          width={advertise?.width}
          height={advertise?.height}
          quantity={Number(advertise?.pillarQuantity)}
          adForm={advertise?.location.adsForm.name}
          locationType={advertise?.location.locationType.name}
        />
        <ContractDetailForm contractId={Number(id)} />
      </Box>
    </Box>
  );
}

export default ContractForm;
