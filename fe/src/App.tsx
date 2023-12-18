import React from "react";
import "./App.scss";
import MapAdsManagement from "./pages/client/MapAdsManagement";
import ContractForm from "pages/admin/CreateContractForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        {/* <MapAdsManagement /> */}
        <ContractForm />
      </div>
    </LocalizationProvider>
  );
}

export default App;
