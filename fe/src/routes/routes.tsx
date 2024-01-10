export const routes = {
  general: {
    notFound: "*",
    unAuthorized: "/Unauthorized"
  },
  client: "/",
  admin: {
    root: "/admin",
    users: {
      dcms: "/admin/dcms/users",
      dcmsCreate: "/admin/dcms/users/create",
      edit: "/admin/users/edit",
      change_password: "/admin/users/change-password"
    },
    reviewEdit: {
      dcms: "/admin/dcms/review/edit",
      dcmsLocation: "/admin/dcms/review/edit/locations/:id",
      dcmsAdvertise: "/admin/dcms/review/edit/advertises/:id"
    },
    reviewLisence: {
      dcms: "/admin/dcms/review/license",
      dcmsDetail: "/admin/dcms/review/license/:id"
    },
    advertises: {
      root: "/admin/advertises",
      create: "/admin/advertises/create",
      edit: "/admin/advertises/edit/:locationId/:advertiseId",
      details: "/admin/advertises/:id",
      ofLocation: "/admin/advertises/locations/:id",
      wardOfLocation: "/admin/ward/locations/:id/advertises",
      wardDetails: "/admin/ward/advertises/:id",
      wardEdit: "/admin/ward/advertises/edit/:locationId/:advertiseId"
    },
    locations: {
      dcms: "/admin/dcms/locations",
      dcmsEdit: "/admin/dcms/locations/edit/:id",
      dcmsCreate: "/admin/dcms/locations/create",
      dcmsDetail: "/admin/dcms/locations/:id",
      root: "/admin/locations",
      create: "/admin/locations/create",
      edit: "/admin/locations/edit/:id",
      district: "/admin/district/locations",
      ward: "/admin/ward/locations",
      wardEdit: "/admin/ward/locations/edit/:id"
    },
    properties: {
      district: "/admin/districts",
      ward: "/admin/districts/:id"
    },
    contracts: {
      root: "/admin/contracts",
      createForm: "/admin/contracts/create-form/:id",
      detail: "/admin/contracts/:id",
      district: "/admin/district/contracts"
    },
    reports: {
      root: "/admin/reports",
      edit: "/admin/reports/edit/:id",
      details: "/admin/report/:id",
      district: "/admin/district/reports",
      ward: "/admin/ward/reports",
      wardEdit: "/admin/ward/reports/edit/:id",
      wardDetails: "/admin/ward/report/:id"
    },
    reportForm: {
      root: "/admin/report-forms"
    },
    advertisesForm: {
      root: "/admin/advertise-forms"
    },
    advertiseType: {
      root: "/admin/advertise-types"
    },
    statistic: {
      dcms: "/admin/dcms/statistic",
      dcmsDetail: "/admin/dcms/statistic/:id"
    },
    authentication: {
      login: "/admin/login"
    },
    forgotPassword: {
      root: "/admin/recover",
      verify: "admin/recover/code",
      reset: "admin/recover/password"
    },
    dashboard: {
      wardDashboard: "/admin/ward/dashboard",
      district: "/admin/district/dashboard"
    }
  }
};
