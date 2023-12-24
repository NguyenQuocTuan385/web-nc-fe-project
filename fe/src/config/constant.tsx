export const API = {
  LOCATION: {
    DEFAULT: "/api/locations"
  },
  ADVERTISE: {
    DEFAULT: "/api/locations/:id/advertises"
  },
  CONTRACT: {
    DEFAULT: "/api/properties/:id/contracts",
    DELETE: "/api/contracts/:id",
    ByAdvertiseId: "/api/advertises/:id/contracts"
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
