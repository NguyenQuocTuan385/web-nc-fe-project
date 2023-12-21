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
import LocationManagement from "pages/admin/ward/pages/LocationsManagement";
import AdvertiseManagement from "pages/admin/ward/pages/AdvertisesManagement";
import { AdvertiseDetail } from "pages/admin/ward/pages/AdvertiseDetail";
import { LocationEdit } from "pages/admin/ward/pages/LocationEdit";
import { AdvertiseEdit } from "pages/admin/ward/pages/AdvertiseEdit";
import ReportsManagement from "pages/admin/ward/pages/ReportsManagement";
import { ReportDetail } from "pages/admin/ward/pages/ReportDetail";
import { ReportHandle } from "pages/admin/ward/pages/ReportHandle";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path='/admin' Component={ReportHandle} />
          {/* <Route path='/' Component={MapAdsManagement} />
          <Route path='/admin/review/edit' Component={EditAdLicense} />

          <Route path='/admin/review/edit/location/:id' Component={EditAdLocationLicenseDetail} />
          <Route path='/admin/review/edit/table/:id' Component={EditAdTableLicenseDetail} />
          <Route path='/admin/review/license' Component={AdLicense} />
          <Route path='/admin/review/license/:id' Component={AdLicenseDetail} />
          <Route path='/contracts/createForm' element={<ContractForm />} />
          <Route path='/contracts' Component={ContractList} /> */}
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
