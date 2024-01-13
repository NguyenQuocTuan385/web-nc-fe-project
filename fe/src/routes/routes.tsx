export const routes = {
  general: {
    notFound: "*",
    unAuthorized: "/Unauthorized"
  },
  client: "/",
  adminMap: "/admin/map",
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
      districtOfLocation: "/admin/district/locations/:id/advertises",
      wardDetails: "/admin/ward/advertises/:id",
      districtDetails: "/admin/district/advertises/:id",
      wardEdit: "/admin/ward/locations/:locationId/advertises/edit/:advertiseId",
      districtEdit: "/admin/district/locations/:locationId/advertises/edit/:advertiseId",
      dcms: "/admin/dcms/advertises/:id",
      dcmsEdit: "/admin/dcms/locations/:locationId/advertises/:advertiseId/edit",
      dcmsCreate: "/admin/dcms/locations/:id/advertises/create"
    },
    locations: {
      dcms: "/admin/dcms/locations",
      dcmsEdit: "/admin/dcms/locations/edit/:id",
      dcmsCreate: "/admin/dcms/locations/create",
      dcmsDetail: "/admin/dcms/locations/:id/advertises",
      root: "/admin/locations",
      create: "/admin/locations/create",
      edit: "/admin/locations/edit/:id",
      district: "/admin/district/locations",
      ward: "/admin/ward/locations",
      wardEdit: "/admin/ward/locations/edit/:id",
      districtEdit: "/admin/district/locations/edit/:id"
    },
    properties: {
      district: "/admin/dcms/districts",
      ward: "/admin/dcms/districts/:id"
    },
    contracts: {
      root: "/admin/contracts",
      createFormWard: "/admin/ward/contracts/create-form/:id",
      createFormDistrict: "/admin/district/contracts/create-form/:id",
      detailWard: "/admin/ward/contracts/:id",
      detailDistrict: "/admin/district/contracts/:id",
      detailDcms: "/admin/dcms/contracts/:id",
      district: "/admin/district/contracts"
    },
    reports: {
      root: "/admin/reports",
      edit: "/admin/reports/edit/:id",
      details: "/admin/report/:id",
      district: "/admin/district/reports",
      ward: "/admin/ward/reports",
      wardEdit: "/admin/ward/reports/edit/:id",
      districtEdit: "/admin/district/reports/edit/:id",
      wardDetails: "/admin/ward/report/:id",
      districtDetails: "/admin/district/report/:id"
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
      district: "/admin/district/dashboard",
      dcms: "/admin/dcms/dashboard"
    }
  }
};
