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
      edit: "/admin/advertises/edit/:id"
    },
    locations: {
      root: "/admin/locations",
      create: "/admin/locations/create",
      edit: "/admin/locations/edit/:id"
    },
    properties: {
      district: "/admin/districts",
      ward: "/admin/districts/:id"
    },
    contracts: {
      root: "/admin/contracts",
      createForm: "/admin/contracts/create-form",
      detail: "/admin/contracts/:id"
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
