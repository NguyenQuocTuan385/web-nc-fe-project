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
import LocationManagement from "pages/admin/LocationsManagement";
import { LocationEdit } from "pages/admin/LocationEdit";
import AdvertisesOfLocationManagement from "pages/admin/AdvertisesOfLocationManagement";
import { AdvertiseDetail } from "pages/admin/AdvertiseDetail";
import { AdvertiseEdit } from "pages/admin/AdvertiseEdit";
import ReportsManagement from "pages/admin/ReportsManagement";
import { ReportHandle } from "pages/admin/ReportHandle";
import { ReportDetail } from "pages/admin/ReportDetail";
import CreateAccount from "pages/admin/CreateAccount";
import ContractDetail from "pages/admin/ContractDetail";
import ReportFormManagement from "pages/admin/ReportFormManagement";
import AdvertiseFormManagement from "pages/admin/AdvertiseFormManagement";
import AdvertiseTypeManagement from "pages/admin/AdvertiseTypeManagement";
import DistrictContractList from "pages/admin/DistrictContractList";
import Login from "pages/admin/Login";
import DistrictLocationManagement from "pages/admin/DistrictLocationsManagement";
import DistrictReportsManagement from "pages/admin/DistrictReportManagement";
import { store } from "store";
import { injectStore } from "services/configApi";
import PersistLogin from "components/common/PersistLogin";
import NotFound from "pages/common/NotFound";

function App() {
  injectStore(store);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path={routes.client} Component={MapAdsManagement} />

          <Route element={<PersistLogin />}>
            <Route path={routes.admin.users.root} Component={UserManagement} />
            <Route path={routes.admin.reviewEdit.root} Component={EditAdLicense} />

            <Route path={routes.admin.users.create} Component={CreateAccount} />

            <Route
              path={routes.admin.reviewEdit.location}
              Component={EditAdLocationLicenseDetail}
            />
            <Route path={routes.admin.reviewEdit.advertise} Component={EditAdTableLicenseDetail} />
            <Route path={routes.admin.reviewLisence.root} Component={AdLicense} />
            <Route path={routes.admin.reviewLisence.detail} Component={AdLicenseDetail} />
            <Route path={routes.admin.properties.district} Component={DistrictManagement} />
            <Route path={routes.admin.properties.ward} Component={WardManagement} />
            <Route path={routes.admin.contracts.createForm} element={<ContractForm />} />
            <Route path={routes.admin.contracts.root} Component={ContractList} />

            {/* Locations */}
            <Route path={routes.admin.locations.root} Component={LocationManagement} />
            <Route path={routes.admin.locations.edit} Component={LocationEdit} />

            {/* Advertises */}
            <Route
              path={routes.admin.advertises.ofLocation}
              Component={AdvertisesOfLocationManagement}
            />
            <Route path={routes.admin.advertises.details} Component={AdvertiseDetail} />
            <Route path={routes.admin.advertises.edit} Component={AdvertiseEdit} />

            {/* Reports */}
            <Route path={routes.admin.reports.root} Component={ReportsManagement} />
            <Route path={routes.admin.reports.edit} Component={ReportHandle} />
            <Route path={routes.admin.reports.details} Component={ReportDetail} />
            <Route path={routes.admin.contracts.detail} Component={ContractDetail} />
            <Route path={routes.admin.reportForm.root} Component={ReportFormManagement} />
            <Route path={routes.admin.advertisesForm.root} Component={AdvertiseFormManagement} />
            <Route path={routes.admin.advertiseType.root} Component={AdvertiseTypeManagement} />

            {/* Districts */}
            <Route path={routes.admin.contracts.district} Component={DistrictContractList} />
            <Route path={routes.admin.locations.district} Component={DistrictLocationManagement} />
            <Route path={routes.admin.reports.district} Component={DistrictReportsManagement} />
          </Route>

          <Route path={routes.admin.authentication.login} Component={Login} />
          <Route path={routes.general} Component={NotFound} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
