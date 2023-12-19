import React from "react";
import "./App.scss";
import MapAdsManagement from "./pages/client/MapAdsManagement";
import UserManagement from "./pages/admin/UserManagement";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdLicense from "pages/admin/AdLicense";
import EditAdLicense from "pages/admin/EditAdLicense";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" Component={UserManagement} />
        <Route path="/" Component={MapAdsManagement} />
        <Route path="/admin/license/edit" Component={EditAdLicense} />
        <Route path="/admin/license" Component={AdLicense} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
