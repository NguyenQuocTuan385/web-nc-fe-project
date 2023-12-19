import React from "react";
import "./App.scss";
import MapAdsManagement from "./pages/client/MapAdsManagement";
import LocationManagement from "pages/admin/ward/pages/LocationsManagement";
import AdvertiseManagement from "pages/admin/ward/pages/AdvertisesManagement";

function App() {
  return (
    <div className="App">
      {/* <MapAdsManagement /> */}
      {/* <LocationManagement/> */}
      <AdvertiseManagement></AdvertiseManagement>
    </div>
  );
}

export default App;
