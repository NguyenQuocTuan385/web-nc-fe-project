export const API = {
  LOCATION: {
    DEFAULT: "/api/locations"
  },
  ADVERTISE: {
    DEFAULT: "/api/locations/:id/advertises"
  },
  CONTRACT: {
    DEFAULT: "/api/contracts",
    DELETE: "/api/contracts/:id"
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
  }
};
