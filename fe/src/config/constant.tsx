export const API = {
  LOCATION: {
    DEFAULT: "/api/locations",
    GET_ALL_REVIEW: "/api/locations/review",
    GET_BY_ID: "/api/locations/:id",
    UPDATE: "/api/locations/:id",
    UPDATE_STATUS: "/api/locations/:id/status",
    DELETE: "/api/locations/edit/:id"
  },
  ADVERTISE: {
    DEFAULT: "/api/locations/:id/advertises",
    UPDATE_LICENSE: "/api/advertises/:id/license",
    UPDATE: "/api/advertises/:id",
    GET_ALL_UNAUTHORIZED: "/api/advertises",
    GET_BY_ID: "/api/advertises/:id",
    DELETE_ADVERTISE_EDIT: "/api/advertises/edit/:id",
    UPDATE_STATUS: "/api/advertises/:id/status",
    DETAILS: "/api/locations/:id",
    EDIT: "/api/locations/:id"
  },
  LOCATION_TYPE: {
    DEFAULT: "/api/location-types"
  },
  CONTRACT: {
    DEFAULT: "/api/properties/:id/contracts",
    DELETE: "/api/contracts/:id",
    ByAdvertiseId: "/api/advertises/:id/contracts",
    ById: "/api/contracts/:id",
    ByAdvertiseIdOne: "/api/contracts/advertises/:id",
    CREATE: "/api/contracts",
    UPDATE_STATUS: "/api/contracts/:id/status",
    GETBYPROPERTY_PARENT_ID: "/api/properties/contracts"
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
