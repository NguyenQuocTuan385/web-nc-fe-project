export const routes = {
  client: "/",
  admin: {
    root: "/admin",
    users: {
      root: "/admin/users",
      create: "/admin/users/create"
    },
    reviewEdit: {
      root: "/admin/review/edit",
      location: "/admin/review/edit/locations/:id",
      advertise: "/admin/review/edit/advertises/:id"
    },
    reviewLisence: {
      root: "/admin/review/license",
      detail: "/admin/review/license/:id"
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
