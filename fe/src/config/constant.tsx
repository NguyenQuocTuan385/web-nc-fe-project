export const API = {
  LOCATION: {
    DEFAULT: "/api/locations",
    DETAILS: "/api/locations/:id",
    EDIT: "/api/locations/:id"
  },
  LOCATION_TYPE: {
    DEFAULT: "/api/location-types"
  },
  ADVERTISE: {
    DEFAULT: "/api/locations/:id/advertises",
    DETAILS: "/api/advertises/:id",
    EDIT: "/api/advertises/:id"
  },
  CONTRACT: {
    DEFAULT: "/api/properties/:id/contracts",
    DELETE: "/api/contracts/:id",
    ByAdvertiseId: "/api/advertises/:id/contracts",
    ById: "/api/contracts/:id",
    ByAdvertiseIdOne: "/api/contracts/advertises/:id",
    CREATE: "/api/contracts"
  },
  DISTRICT: {
    DEFAULT: "/api/properties",
    UPDATE: "/api/properties/:id",
    DELETE: "/api/properties/:id",
    ALL: "/api/properties/all"
  },
  WARD: {
    DEFAULT: "/api/properties/:propertyParentId"
  },
  USER: {
    DEFAULT: "/api/users",
    UPDATE: "/api/users/:id",
    CREATE: "/api/users",
    DELETE: "/api/users/:id",
    DETAIL: "/api/users/:id"
  },
  REPORT: {
    DEFAULT: "/api/reports",
    DETAILS: "/api/reports/:id",
    UPDATE: "/api/reports/:id"
  },
  REPORT_FORM: {
    DEFAULT: "/api/report-forms"
  },
  ADVERTISE_FORM: {
    DEFAULT: "/api/advertise-forms"
  },
  ADVERTISE_TYPE: {
    DEFAULT: "/api/advertise-types"
  }
};
