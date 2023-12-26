import React from "react";
import "./App.scss";
import MapAdsManagement from "./pages/client/MapAdsManagement";
import UserManagement from "./pages/admin/UserManagement";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdLicense from "pages/admin/AdLicense";
import EditAdLicense from "pages/admin/EditAdLicense";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ContractForm from "pages/admin/CreateContractForm";
import EditAdLocationLicenseDetail from "pages/admin/EditAdLicense/components/EditAdLocationLicense/EditAdLocationLicenseDetail";
import ContractList from "pages/admin/ContractList";
import EditAdTableLicenseDetail from "pages/admin/EditAdLicense/components/EditAdTableLicense/EditAdTableLicenseDetail";
import AdLicenseDetail from "pages/admin/AdLicense/components/AdLicenseDetail";
import DistrictManagement from "pages/admin/DistrictManagement";
import WardManagement from "pages/admin/WardManagement";
import { routes } from "routes/routes";
import CreateAccount from "pages/admin/CreateAccount";
import ContractDetail from "pages/admin/ContractDetail";
import ReportFormManagement from "pages/admin/ReportFormManagement";
import AdvertiseFormManagement from "pages/admin/AdvertiseFormManagement";
import AdvertiseTypeManagement from "pages/admin/AdvertiseTypeManagement";
import DistrictContractList from "pages/admin/DistrictContractList";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path={routes.admin.users.root} Component={UserManagement} />
          <Route path={routes.client} Component={MapAdsManagement} />
          <Route path={routes.admin.reviewEdit.root} Component={EditAdLicense} />

          <Route path={routes.admin.users.create} Component={CreateAccount} />

          <Route path={routes.admin.reviewEdit.location} Component={EditAdLocationLicenseDetail} />
          <Route path={routes.admin.reviewEdit.advertise} Component={EditAdTableLicenseDetail} />
          <Route path={routes.admin.reviewLisence.root} Component={AdLicense} />
          <Route path={routes.admin.reviewLisence.detail} Component={AdLicenseDetail} />
          <Route path={routes.admin.properties.district} Component={DistrictManagement} />
          <Route path={routes.admin.properties.ward} Component={WardManagement} />
          <Route path={routes.admin.contracts.createForm} element={<ContractForm />} />
          <Route path={routes.admin.contracts.root} Component={ContractList} />

          <Route path={routes.admin.contracts.detail} Component={ContractDetail} />
          <Route path={routes.admin.reportForm.root} Component={ReportFormManagement} />
          <Route path={routes.admin.advertisesForm.root} Component={AdvertiseFormManagement} />
          <Route path={routes.admin.advertiseType.root} Component={AdvertiseTypeManagement} />

          <Route path={routes.admin.contracts.district} Component={DistrictContractList} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
