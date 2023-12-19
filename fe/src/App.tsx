import React from "react";
import "./App.scss";
import MapAdsManagement from "./pages/client/MapAdsManagement";
import UserManagement from "./pages/admin/UserManagement";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" Component={UserManagement} />
        <Route path="/" Component={MapAdsManagement} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
