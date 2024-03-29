export const API = {
  LOCATION: {
    DEFAULT: "/api/locations",
    GET_ALL_REVIEW: "/api/locations/review",
    EXISTS_ADVERTISES: "/api/locations/:id/exists-advertises",
    GET_BY_ID: "/api/locations/:id",
    UPDATE: "/api/locations/:id",
    UPDATE_STATUS: "/api/locations/:id/status",
    DELETE: "/api/locations/edit/:id",
    EDIT: "/api/locations/:id",
    GET_BY_PROPERTY_ID: "/api/properties/:id/locations",
    GET_WITH_PROPERTY_PARENT: "/api/properties/locations",
    DELETE_LOCATION: "/api/locations/:id"
  },
  LOCATION_CLIENT: {
    DEFAULT: "/api/locations-client",
    EXISTS_ADVERTISES: "/api/locations-client/:id/exists-advertises"
  },
  ADVERTISE: {
    DEFAULT: "/api/locations/:id/advertises",
    UPDATE_LICENSE: "/api/advertises/:id/license",
    UPDATE: "/api/advertises/:id",
    GET_ALL_UNLICENSING: "/api/advertises",
    GET_BY_ID: "/api/advertises/:id",
    DELETE_ADVERTISE_EDIT: "/api/advertises/edit/:id",
    UPDATE_STATUS: "/api/advertises/:id/status",
    DETAILS: "/api/locations/:id",
    EDIT: "/api/advertises/:id",
    CREATE: "/api/advertises",
    DELETE: "/api/advertises/:id"
  },
  ADVERTISE_CLIENT: {
    DEFAULT: "/api/locations-client/:id/advertises"
  },
  LOCATION_TYPE: {
    DEFAULT: "/api/location-types"
  },
  CONTRACT: {
    DEFAULT: "/api/properties/:id/contracts",
    DELETE: "/api/contracts/:id",
    BY_ADVERTISE_ID: "/api/advertises/:id/contracts",
    ById: "/api/contracts/:id",
    CONTRACTBYPROPERTY: "/api/properties/contracts",
    UPDATE_STATUS: "/api/contracts/:id/status",
    BY_ADVERTISE_ID_ONE: "/api/contracts/advertises/:id",
    CREATE: "/api/contracts",
    GETBYPROPERTY_PARENT_ID: "/api/properties/contracts"
  },
  CONTRACT_CLIENT: {
    BY_ADVERTISE_ID_ONE: "/api/contracts-client/advertises/:id"
  },
  DISTRICT: {
    DEFAULT: "/api/properties",
    UPDATE: "/api/properties/:id",
    DELETE: "/api/properties/:id",
    GET_BY_PARENT_ID: "/api/properties/:id",
    ALL: "/api/properties/all"
  },
  PROPERTY: {
    FIND_PROPERTY_BY_WARD_AND_DISTRICT: "/api/properties/findByWardAndDistrict"
  },
  PROPERTY_CLIENT: {
    FIND_PROPERTY_BY_WARD_AND_DISTRICT: "/api/properties-client/findByWardAndDistrict"
  },
  WARD: {
    DEFAULT: "/api/properties/:propertyParentId",
    DELETE: "/api/properties/:id",
    UPDATE: "/api/properties/:id"
  },
  USER: {
    DEFAULT: "/api/users",
    UPDATE: "/api/users/:id",
    CREATE: "/api/users",
    DELETE: "/api/users/:id",
    DETAIL: "/api/users/:id",
    CHECK_OTP: "/api/users/checkOTP",
    EMAIL: "/api/users/FindByEmail/:email"
  },
  REPORT: {
    DEFAULT: "/api/reports",
    CREATE: "/api/reports",
    DETAILS: "/api/reports/:id",
    UPDATE: "/api/reports/:id",
    GET_WITH_PROPERTY_PARENT: "/api/properties/reports"
  },
  REPORT_CLIENT: {
    DEFAULT: "/api/reports-client",
    CREATE: "/api/reports-client",
    DETAILS: "/api/reports-client/:id"
  },
  REPORT_FORM: {
    DEFAULT: "/api/report-forms",
    DELETE: "/api/report-forms/:id",
    CREATE: "/api/report-forms",
    UPDATE: "/api/report-forms/:id"
  },
  REPORT_FORM_CLIENT: {
    DEFAULT: "/api/report-forms-client"
  },
  ADVERTISE_FORM: {
    DEFAULT: "/api/advertise-forms",
    DELETE: "/api/advertise-forms/:id",
    CREATE: "/api/advertise-forms",
    UPDATE: "/api/advertise-forms/:id"
  },
  ADVERTISE_TYPE: {
    DEFAULT: "/api/advertise-types",
    DELETE: "/api/advertise-types/:id",
    CREATE: "/api/advertise-types",
    UPDATE: "/api/advertise-types/:id"
  },
  AUTH: {
    LOGIN: "/api/authentication/login",
    REGISTER: "/api/authentication/register",
    REFRESH: "/api/authentication/refresh",
    CHANGE_PASSWORD: "/api/authentication/change-password",
    RESET_PASSWORD: "/api/authentication/reset-password",
    LOGOUT: "/api/authentication/logout"
  },
  EMAIL: {
    SEND_TEXT_EMAIL: "/api/email/text",
    SEND_HTML_EMAIL: "/api/email/html",
    SEND_OTP_TO_EMAIL: "/api/email/otp"
  }
};
