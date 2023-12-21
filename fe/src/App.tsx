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

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" Component={UserManagement} />
          <Route path="/" Component={MapAdsManagement} />
          <Route path="/admin/review/edit" Component={EditAdLicense} />

          <Route
            path="/admin/review/edit/:id"
            Component={EditAdLocationLicenseDetail}
          />
          <Route path="/admin/review/license" Component={AdLicense} />
          <Route path="/contracts/createForm" element={<ContractForm />} />
          <Route path="/contracts" Component={ContractList} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
