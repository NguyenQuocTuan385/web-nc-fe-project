import React from "react";
import "./App.scss";
import MapAdsManagement from "./pages/client/MapAdsManagement";
import UserManagement from "./pages/admin/UserManagement";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdLicense from "pages/admin/AdLicense";
import EditAdLicense from "pages/admin/EditAdLicense";
import EditAdLocationLicenseDetail from "pages/admin/EditAdLicense/components/EditAdLocationLicense/EditAdLocationLicenseDetail";

function App() {
  return (
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
