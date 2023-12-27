export const API = {
  LOCATION: {
    DEFAULT: "/api/locations"
  },
  ADVERTISE: {
    DEFAULT: "/api/locations/:id/advertises",
    UPDATE_LICENSE: "/api/advertises/:id/license"
  },
  CONTRACT: {
    DEFAULT: "/api/properties/:id/contracts",
    DELETE: "/api/contracts/:id",
    ByAdvertiseId: "/api/advertises/:id/contracts",
    ById: "/api/contracts/:id",
    CONTRACTBYPROPERTY: "/api/properties/contracts"
    UPDATE_STATUS: "/api/contracts/:id/status",
    CREATE: "/api/contracts",
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
    DEFAULT: "/api/reports"
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
