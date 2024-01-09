export const routes = {
  client: "/",
  admin: {
    root: "/admin",
    users: {
      dcms: "/admin/dcms/users",
      dcmsCreate: "/admin/dcms/users/create"
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
      ofLocation: "/admin/advertises/locations/:id"
    },
    locations: {
      dcms: "/admin/dcms/locations",
      dcmsEdit: "/admin/dcms/locations/edit/:id",
      dcmsCreate: "/admin/dcms/locations/create",
      dcmsDetail: "/admin/dcms/locations/:id",
      root: "/admin/locations",
      create: "/admin/locations/create",
      edit: "/admin/locations/edit/:id",
      district: "/admin/district/locations"
    },
    properties: {
      district: "/admin/districts",
      ward: "/admin/districts/:id"
    },
    contracts: {
      root: "/admin/contracts",
      createForm: "/admin/contracts/create-form/:id",
      detail: "/admin/contracts/:id",
      district: "admin/district/contracts"
    },
    reports: {
      root: "/admin/reports",
      edit: "/admin/reports/edit/:id",
      details: "/admin/report/:id",
      district: "/admin/district/reports"
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
    authentication: {
      login: "/admin/login"
    }
  }
};
