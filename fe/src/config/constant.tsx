export const API = {
  LOCATION: {
    DEFAULT: "/api/locations"
  },
  ADVERTISE: {
    DEFAULT: "/api/locations/:id/advertises"
  },
  CONTRACT: {
    DEFAULT: "/api/contracts",
    DELETE: "/api/contracts/:id",
    ByAdvertiseId: "/api/advertises/:id/contracts"
  },
  DISTRICT: {
    DEFAULT: "/api/properties",
    UPDATE: "/api/properties/:id",
    DELETE: "/api/properties/:id"
  },
  WARD: {
    DEFAULT: "/api/properties/:propertyParentId"
  },
  REPORT: {
    DEFAULT: "/api/reports"
  }
};
