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
import LocationManagement from "pages/admin/ward/pages/LocationsManagement";
import AdvertiseManagement from "pages/admin/ward/pages/AdvertisesManagement";
import ReportsManagement from "pages/admin/ward/pages/ReportsManagement";
import { ReportDetail } from "pages/admin/ward/pages/ReportDetail";
import { ReportHandle } from "pages/admin/ward/pages/ReportHandle";
import { AdvertiseDetail } from "pages/admin/ward/pages/AdvertiseDetail";
import { LocationEdit } from "pages/admin/ward/pages/LocationEdit";
import { AdvertiseEdit } from "pages/admin/ward/pages/AdvertiseEdit";
function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={MapAdsManagement} />
          <Route path='/admin' Component={UserManagement} />

          <Route path='/admin'>
            <Route path='review'>
              <Route path='edit' Component={EditAdLicense} />
              <Route path='edit/location/:id' Component={EditAdLocationLicenseDetail} />
              <Route path='edit/table/:id' Component={EditAdTableLicenseDetail} />
              <Route path='license' Component={AdLicense} />
              <Route path='license/:id' Component={AdLicenseDetail} />
            </Route>

            <Route path='districts'>
              <Route path='' Component={DistrictManagement} />
              <Route path=':id' Component={WardManagement} />
            </Route>

            <Route path='contracts'>
              <Route path='' Component={ContractList} />
              <Route path='createForm' element={<ContractForm />} />
            </Route>

            <Route path='locations'>
              <Route path='' Component={LocationManagement}></Route>
              <Route path='edit/:id' Component={LocationEdit}></Route>
            </Route>

            <Route path='advertises'>
              <Route path='' Component={AdvertiseManagement}></Route>
              <Route path=':id' Component={AdvertiseDetail}></Route>
              <Route path='edit/:id' Component={AdvertiseEdit}></Route>
            </Route>

            <Route path='reports'>
              <Route path='' Component={ReportsManagement}></Route>
              <Route path=':id' Component={ReportDetail}></Route>
              <Route path='edit/:id' Component={ReportHandle}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
