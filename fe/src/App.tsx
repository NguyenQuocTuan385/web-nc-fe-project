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
import ReportStatistic from "pages/admin/ReportStatistic";

import LocationManagementDCMS from "pages/admin/LocationManagementDCMS";
import { LocationEditCDMS } from "pages/admin/LocationEditDCMS";
import { LocationCreateCDMS } from "pages/admin/LocationCreateDCMS";
import AdvertisesOfLocationManagementDCMS from "pages/admin/AdvertisesOfLocationManagementDCMS";

import DistrictLocationManagement from "pages/admin/DistrictLocationsManagement";
import DistrictReportsManagement from "pages/admin/DistrictReportManagement";
import ForgotPassword from "pages/admin/ForgotPassword";
import VerifyOTP from "pages/admin/ForgotPassword/components/VerifyOTP";
import ResetPassword from "pages/admin/ForgotPassword/components/ResetPassword";
import { store } from "store";
import { injectStore } from "services/configApi";
import PersistLogin from "components/common/PersistLogin";
import NotFound from "pages/common/NotFound";
import RequireAuth from "components/common/RequireAuth";
import { ERole } from "models/general";
import UnAuthorized from "pages/common/UnAuthorized";
import { WardDashBoard } from "pages/admin/WardDashboard";
import EditProfile from "pages/admin/EditProfile";
import ChangePassword from "pages/admin/ChangePassword";
import { DistrictDashBoard } from "pages/admin/DistrictDashboard";
import { ReportDetailDCMS } from "pages/admin/ReportStatistic/components/ReportDetail";

function App() {
  injectStore(store);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path={routes.client} Component={MapAdsManagement} />
          <Route element={<PersistLogin />}>
            {/* DEPARTMENT */}
            <Route element={<RequireAuth availableRoles={[ERole.DEPARTMENT]} />}>
              <Route path={routes.admin.users.dcms} Component={UserManagement} />
              <Route path={routes.admin.reviewEdit.dcms} Component={EditAdLicense} />
              <Route path={routes.admin.users.dcmsCreate} Component={CreateAccount} />
              <Route
                path={routes.admin.reviewEdit.dcmsLocation}
                Component={EditAdLocationLicenseDetail}
              />
              <Route
                path={routes.admin.reviewEdit.dcmsAdvertise}
                Component={EditAdTableLicenseDetail}
              />
              <Route path={routes.admin.reviewLisence.dcms} Component={AdLicense} />
              <Route path={routes.admin.reviewLisence.dcmsDetail} Component={AdLicenseDetail} />

              {/* Location DCMS  */}
              <Route path={routes.admin.locations.dcms} Component={LocationManagementDCMS} />
              <Route path={routes.admin.locations.dcmsEdit} Component={LocationEditCDMS} />
              <Route path={routes.admin.locations.dcmsCreate} Component={LocationCreateCDMS} />
              <Route
                path={routes.admin.locations.dcmsDetail}
                Component={AdvertisesOfLocationManagementDCMS}
              />

              {/* REVIEW LOCATION, ADVERTISE */}

              <Route
                path={routes.admin.reviewEdit.dcmsLocation}
                Component={EditAdLocationLicenseDetail}
              />
              <Route
                path={routes.admin.reviewEdit.dcmsAdvertise}
                Component={EditAdTableLicenseDetail}
              />

              {/* REPORT */}
              <Route path={routes.admin.statistic.dcms} Component={ReportStatistic} />
              <Route path={routes.admin.statistic.dcmsDetail} Component={ReportDetailDCMS} />
            </Route>

            <Route path={routes.admin.properties.district} Component={DistrictManagement} />
            <Route path={routes.admin.properties.ward} Component={WardManagement} />
            <Route path={routes.admin.contracts.createForm} element={<ContractForm />} />

            <Route path={routes.admin.users.edit} Component={EditProfile} />
            <Route path={routes.admin.users.change_password} Component={ChangePassword} />

            {/* Ward */}
            <Route element={<RequireAuth availableRoles={[ERole.WARD]} />}>
              {/* Locations Ward*/}
              <Route path={routes.admin.locations.ward} Component={LocationManagement} />
              <Route path={routes.admin.contracts.root} Component={ContractList} />

              {/* Reports Ward*/}
              <Route path={routes.admin.reports.ward} Component={ReportsManagement} />

              {/* Dashboard Ward */}
              <Route path={routes.admin.dashboard.wardDashboard} Component={WardDashBoard} />
            </Route>

            {/* Reports */}
            <Route path={routes.admin.reports.root} Component={ReportsManagement} />
            <Route path={routes.admin.reports.edit} Component={ReportHandle} />
            <Route path={routes.admin.reports.details} Component={ReportDetail} />
            <Route path={routes.admin.contracts.detail} Component={ContractDetail} />
            <Route path={routes.admin.reportForm.root} Component={ReportFormManagement} />
            <Route path={routes.admin.advertisesForm.root} Component={AdvertiseFormManagement} />
            <Route path={routes.admin.advertiseType.root} Component={AdvertiseTypeManagement} />

            {/* Districts */}
            <Route element={<RequireAuth availableRoles={[ERole.DISTRICT]} />}>
              <Route path={routes.admin.contracts.district} Component={DistrictContractList} />
              <Route
                path={routes.admin.locations.district}
                Component={DistrictLocationManagement}
              />
              <Route path={routes.admin.reports.district} Component={DistrictReportsManagement} />
              <Route path={routes.admin.dashboard.district} Component={DistrictDashBoard} />
            </Route>

            <Route element={<RequireAuth availableRoles={[ERole.WARD, ERole.DISTRICT]} />}>
              <Route path={routes.admin.properties.ward} Component={WardManagement} />
              <Route path={routes.admin.contracts.createForm} element={<ContractForm />} />
              <Route path={routes.admin.contracts.detail} Component={ContractDetail} />

              <Route path={routes.admin.locations.wardEdit} Component={LocationEdit} />

              {/* Advertises */}
              <Route path={routes.admin.advertises.details} Component={AdvertiseDetail} />
              <Route path={routes.admin.advertises.edit} Component={AdvertiseEdit} />
              <Route
                path={routes.admin.advertises.ofLocation}
                Component={AdvertisesOfLocationManagement}
              />

              {/* Advertises Ward*/}
              <Route
                path={routes.admin.advertises.wardOfLocation}
                Component={AdvertisesOfLocationManagement}
              />
              <Route path={routes.admin.advertises.wardDetails} Component={AdvertiseDetail} />
              <Route path={routes.admin.advertises.wardEdit} Component={AdvertiseEdit} />

              {/* Reports Ward*/}
              <Route path={routes.admin.reports.wardEdit} Component={ReportHandle} />
              <Route path={routes.admin.reports.wardDetails} Component={ReportDetail} />
            </Route>

            <Route path={routes.admin.properties.district} Component={DistrictManagement} />

            {/* Locations Ward*/}

            <Route path={routes.admin.locations.wardEdit} Component={LocationEdit} />

            {/* Advertises */}

            <Route path={routes.admin.advertises.details} Component={AdvertiseDetail} />
            <Route path={routes.admin.advertises.edit} Component={AdvertiseEdit} />

            {/* Advertises Ward*/}

            <Route
              path={routes.admin.advertises.wardOfLocation}
              Component={AdvertisesOfLocationManagement}
            />
            <Route path={routes.admin.advertises.wardDetails} Component={AdvertiseDetail} />
            <Route path={routes.admin.advertises.wardEdit} Component={AdvertiseEdit} />

            {/* Reports Ward*/}

            <Route path={routes.admin.reports.wardEdit} Component={ReportHandle} />
            <Route path={routes.admin.reports.wardDetails} Component={ReportDetail} />

            {/* Reports */}
            <Route path={routes.admin.reports.root} Component={ReportsManagement} />
            <Route path={routes.admin.reports.edit} Component={ReportHandle} />
            <Route path={routes.admin.reports.details} Component={ReportDetail} />
            <Route path={routes.admin.reportForm.root} Component={ReportFormManagement} />
            <Route path={routes.admin.advertisesForm.root} Component={AdvertiseFormManagement} />
            <Route path={routes.admin.advertiseType.root} Component={AdvertiseTypeManagement} />
            {/* <Route path={routes.admin.statistic.root} Component={ReportStatistic} />
            <Route path={routes.admin.statistic.detail} Component={ReportDetail} /> */}

            {/* General */}
            <Route path={routes.admin.authentication.login} Component={Login} />
          </Route>

          {/* forgot password */}
          <Route path={routes.admin.forgotPassword.root} Component={ForgotPassword} />
          <Route path={routes.admin.forgotPassword.verify} Component={VerifyOTP} />
          <Route path={routes.admin.forgotPassword.reset} Component={ResetPassword} />

          <Route path={routes.general.notFound} Component={NotFound} />
          <Route path={routes.general.unAuthorized} Component={UnAuthorized} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
