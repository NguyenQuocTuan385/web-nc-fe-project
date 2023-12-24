export const API = {
  LOCATION: {
    DEFAULT: "/api/locations"
  },
  ADVERTISE: {
    DEFAULT: "/api/locations/:id/advertises",
    DETAILS: "/api/advertises/:id"
  },
  CONTRACT: {
    DEFAULT: "/api/contracts",
    WITH_ADVERTISE: "/api/contracts/advertises/:id",
    DELETE: "/api/contracts/:id"
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
