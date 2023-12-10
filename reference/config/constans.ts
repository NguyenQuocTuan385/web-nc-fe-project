export const API = {
  AUTH: {
    ME: '/v1.0/user/me',
    LOGIN: '/v1.0/user/login',
    LOGIN_SOCIAL: '/v1.0/user/login/social',
    SEND_VERIFY_EMAIL: '/v1.0/user/send-verify-email',
    REGISTER: '/v1.0/user/register',
    ACTIVE: '/v1.0/user/active',
    SEND_EMAIL_FORGOT_PASSWORD: '/v1.0/user/send-email-forgot-password',
    FORGOT_PASSWORD: '/v1.0/user/forgot-password',
    CHECK_ISVALID_CODE: '/v1.0/user/check-isvalid-code',
    CHECK_EMPTY_PASSWORD: '/v1.0/user/check-empty-password',
    CHECK_EMAIL: '/v1.0/user/check-email',
    CHANGE_LANGUAGE: '/v1.0/user/change-language',
    CHANGE_CURRENCY: '/v1.0/user/change-currency',
    
  },
  USER: {
    DEFAULT: '/v1.0/user',
    PAYMENT_INFO: '/v1.0/user/payment-info',
    UPDATE_PAYMENT_INFO: '/v1.0/user/update-payment-info',
    UPDATE_PROFILE: '/v1.0/user/update-profile',
    CHANGE_PASSWORD: '/v1.0/user/change-password',
    UPDATE_AVATAR: '/v1.0/user/update-avatar',
    INFO_USER_GUEST: '/v1.0/user/create-guest-account'
  },
  COUNTRY: {
    LIST: '/v1.0/country',
  },
  CONFIG: {
    DEFAULT: '/v1.0/config',
  },
  SOLUTION: {
    DEFAULT: '/v1.0/solution',
    CATEGORY: '/v1.0/solution/categories',
    CATEGORY_HOME: '/v1.0/solution/categories-home'
  },
  PLAN: {
    DEFAULT: '/v1.0/plan',
  },
  PROJECT: {
    DEFAULT: '/v1.0/project',
    RENAME: '/v1.0/project/:id/rename',
    MOVE: '/v1.0/project/:id/move-project',
    BASIC_INFORMATION: '/v1.0/project/:id/basic-information',
    TARGET: '/v1.0/project/:id/target',
    SAMPLE_SIZE: '/v1.0/project/:id/sample-size',
    EYE_TRACKING_SAMPLE_SIZE: '/v1.0/project/:id/eye-tracking-sample-size',
    UPDATE_ENABLE_CUSTOM_QUESTION: '/v1.0/project/:id/update-enable-custom-question',
    UPDATE_ENABLE_EYE_TRACKING: "/v1.0/project/:id/update-enable-eye-tracking",
    SEND_EMAIL_HOW_TO_SETUP_SURVEY: "/v1.0/project/:id/send-email-how-to-setup-survey",
    UPDATE_AGREE_QUOTA: '/v1.0/project/:id/update-agree-quota',
    QUOTA: {
      DEFAULT: '/v1.0/project/:id/quota',
    },
    CANCEL_PAYMENT_SCHEDULE_SUBSCRIPTION: '/v1.0/project/cancel-subscription',
    CAN_CHANGE_PERMISSION_AND_SHARE: '/v1.0/project/:id/update-change-permission-share',
    CHECK_PARAMS_CREATE_PROJECT: '/v1.0/solution/check-exist-solution-plan',
  },
  FOLDER: {
    DEFAULT: '/v1.0/folder',
  },
  PACK: {
    DEFAULT: '/v1.0/pack',
  },
  ADDITIONAL_BRAND: {
    DEFAULT: '/v1.0/additional-brand',
  },
  ATTRIBUTE: {
    DEFAULT: '/v1.0/additional-attribute',
  },
  PROJECT_ATTRIBUTE: {
    DEFAULT: '/v1.0/project-attribute',
  },
  PROJECT_BRAND: {
    DEFAULT: '/v1.0/project-brand',
  },
  PROJECT_RESULT: {
    DEFAULT: '/v1.0/project-result',
  },
  PROJECT_USER: {
    DEFAULT: '/v1.0/project-user',
    DETAIL: '/v1.0/project-user/:id',
  },
  BRAND_ASSET: {
    DEFAULT: '/v1.0/brand-asset',
  },
  USER_ATTRIBUTE: {
    DEFAULT: '/v1.0/user-attribute',
  },
  CUSTOM_QUESTION: {
    DEFAULT: '/v1.0/custom-question',
    UPDATE_ORDER: '/v1.0/custom-question/update-order',
    GET_TYPES: '/v1.0/custom-question/type', 
    QUESTION: '/v1.0/custom-question/:id',
  },
  TRANSLATION: {
    DEFAULT: '/v1.0/translation/{{lng}}/{{ns}}',
  },
  TARGET: {
    DEFAULT: '/v1.0/target/question',
  },
  QUOTA: {
    DEFAULT: '/v1.0/quota',
    ALL: '/v1.0/quota/all'
  },
  PAYMENT: {
    CHECKOUT: '/v1.0/payment/checkout',
    CHECKOUT_PAYMENT_SCHEDULE: '/v1.0/payment/checkout/payment-schedule',
    CONFIRM: '/v1.0/payment/confirm-payment',
    INVOICE: '/v1.0/payment/invoice',
    PAYMENT_HISTORY: '/v1.0/payment/history',
    INVOICE_DEMO: '/v1.0/payment/invoice-demo',
    VALID_CONFIRM: '/v1.0/payment/valid-confirm',
    ONEPAY_CALLBACK: '/v1.0/payment/onepay/callback',
    ONEPAY_CALLBACK_PAYMENT_SCHEDULE: '/v1.0/payment/onepay/callback/payment-schedule',
    CANCEL: '/v1.0/payment/:id/cancel',
    TRY_AGAIN: '/v1.0/payment/:id/try-again',
    UPDATE_INVOICE_INFO: '/v1.0/payment/:id/invoice-info',
    CHANGE_PAYMENT_METHOD: '/v1.0/payment/:id/change-payment-method',
    SCHEDULE_INVOICE: '/v1.0/payment/payment-schedule-invoice',
    SCHEDULE_INVOICE_DEMO: '/v1.0/payment/payment-schedule-invoice-demo',
  },
  PAYMENT_SCHEDULE: {
    PREVIEW: 'v1.0/payment-schedule/preview',
    MAKE_AN_ORDER: 'v1.0/payment-schedule/make-order',
    PAYMENT: 'v1.0/payment-schedule/next-payment',
    PAYMENT_SCHEDULE_HISTORY: 'v1.0/payment/history/brand-track',
    LATEST_PAID: 'v1.0/payment-schedule/latest-paid',
    DETAIL: 'v1.0/payment-schedule/:id',
    CANCEL_PAYMENT: 'v1.0/payment-schedule/cancel-payment',
    CONFIRM_PAYMENT: 'v1.0/payment-schedule/confirm-payment',
  },
  ATTACHMENT: {
    DEFAULT: '/v1.0/attachment/',
    DOWNLOAD: '/v1.0/attachment/:id/download',
    DOWNLOAD_BASE64: '/v1.0/attachment/:id/download-base64',
    DOWNLOAD_BY_URL: '/v1.0/attachment/download',
    
  },
  CUSTOM_QUESTION_TYPE: {
    DEFAULT: '/v1.0/custom-question-type',
  },
  ADMIN: {
    SOLUTION: {
      DEFAULT: '/v1.0/admin/solution',
      UPDATE_STATUS: '/v1.0/admin/solution/update-status/:id',
    },
    SOLUTION_CATEGORY: {
      DEFAULT: '/v1.0/admin/solution-category',
      UPDATE_STATUS: '/v1.0/admin/solution-category/update-status/:id',
    },
    SOLUTION_CATEGORY_HOME: {
      DEFAULT: '/v1.0/admin/solution-category-home',
      UPDATE_STATUS: '/v1.0/admin/solution-category-home/update-status/:id',
    },
    PLAN: {
      DEFAULT: '/v1.0/admin/plan',
      UPDATE_STATUS: '/v1.0/admin/plan/update-status/:id',
    },
    ATTRIBUTE: {
      DEFAULT: '/v1.0/admin/attribute',
      STATUS_DETAIL:'/v1.0/admin/attribute/:id/status'
    },
    ATTRIBUTE_CATEGORY: {
      DEFAULT: '/v1.0/admin/attribute-category',
      UPDATE_STATUS: '/v1.0/admin/attribute-category/update-status/:id',
    },
    TRANSLATION: {
      DEFAULT: '/v1.0/admin/translation',
    },
    TARGET: {
      QUESTION: {
        DEFAULT: '/v1.0/admin/target/question',
      },
      ANSWER: {
        DEFAULT: '/v1.0/admin/target/answer',
      },
      ANSWER_GROUP: {
        DEFAULT: '/v1.0/admin/target/answer-group',
      },
      ANSWER_SUGGESTION: {
        DEFAULT: '/v1.0/admin/target/answer-suggestion',
      }
    },
    SAMPLE_SIZE: {
      DEFAULT: '/v1.0/admin/sample-size',
    },
    EYE_TRACKING_SAMPLE_SIZE: {
      DEFAULT: '/v1.0/admin/eye-tracking-sample-size',
    },
    QUOTA: {
      TABLE: {
        DEFAULT: '/v1.0/admin/quota/table',
      }
    },
    EMAIL_TEMPLATE: {
      DEFAULT: '/v1.0/admin/email-template'
    },
    EMAIL_REMINDER: {
      DEFAULT: '/v1.0/admin/email-reminder'
    },
    CONFIG: {
      DEFAULT: '/v1.0/admin/config',
    },
    PROJECT: {
      DEFAULT: '/v1.0/admin/project',
      QUOTA: '/v1.0/admin/project/:id/quota',
      PACK: '/v1.0/admin/project/:id/packs',
      VIDEO: '/v1.0/admin/project/:id/videos',
      PRICE_TEST: '/v1.0/admin/project/:id/price-test',
      EYE_TRACKING_PACK: '/v1.0/admin/project/:id/eye-tracking-packs',
      ADDITIONAL_BRAND: '/v1.0/admin/project/:id/additional-brands',
      PROJECT_ATTRIBUTE: '/v1.0/admin/project/:id/project-attributes',
      USER_ATTRIBUTE: '/v1.0/admin/project/:id/user-attributes',
      CUSTOM_QUESTION: '/v1.0/admin/project/:id/custom-questions',
      TARGET: '/v1.0/admin/project/:id/targets',
      MAIN_BRANDS: '/v1.0/admin/project/:id/main-brands',
      COMPETING_BRANDS: '/v1.0/admin/project/:id/competing-brands',
      COMPETITIVE_BRANDS: '/v1.0/admin/project/:id/competitive-brands',
      BRAND_ASSET: '/v1.0/admin/project/:id/brand-asset',
      PAYMENT_SCHEDULE: '/v1.0/admin/project/:id/payment-schedule'
    },
    PAYMENT_SCHEDULE: {
      UPDATE_STATUS: '/v1.0/admin/payment-schedule/:id/update-status',
      UPDATE_BASIC_INFO: '/v1.0/admin/payment-schedule/:id/basic-info',
      UPLOAD_INVOICE: '/v1.0/admin/payment-schedule/:id/upload-invoice',
      INVOICE_READY: '/v1.0/admin/payment-schedule/:id/invoice-ready',
      RESTART: '/v1.0/admin/payment-schedule/restart',
      PREVIEW_RESTART: '/v1.0/admin/payment-schedule/preview-restart',
    },
    PROJECT_RESULT: {
      DEFAULT: '/v1.0/admin/project-result',
      DETAIL: '/v1.0/admin/project-result/:id',
      UPDATE_READY: '/v1.0/admin/project-result/:id/update-ready',
    },
    USER: {
      DEFAULT: '/v1.0/admin/user',
      RESTORE: '/v1.0/admin/user/:id/restore'
    },
    CUSTOM_QUESTION_TYPE: {
      DEFAULT: '/v1.0/admin/custom-question-type',
    },
    PAYMENT: {
      DEFAULT: '/v1.0/admin/payment',
    },
    PROJECT_USER: {
      DEFAULT: '/v1.0/admin/project-user',
      SEND_INVITE_EMAIL: '/v1.0/admin/project-user/send-invitation-email',
      UPDATE_PROJECT_ROLE: '/v1.0/admin/project-user/update-project-role',
      REMOVE_ACCESS: '/v1.0/admin/project-user/:id/remove-access',
      RESEND_INVITATION: '/v1.0/admin/project-user/resend-invitation-email'
    },
    APIKEY:{
      DEFAULT: '/v1.0/admin/api-key',
    },
    WEBHOOK:{
      DEFAULT: '/v1.0/admin/webhook',
    }
  },
  GOOGLE_APIS: {
    VIDEO_YOUTUBE: {
      DEFAULT: '/v1.0/googleapis/videos-youtube'
    }
  },
  VIDEO: {
    DEFAULT: '/v1.0/video',
    CHECK_YOUTUBE_LINK: '/v1.0/video/check-youtube-link'
  },
  PRICE_TEST: {
    DEFAULT: '/v1.0/price-test',
    CHANGE_TYPE: '/v1.0/price-test/:id/change-type',
    PICTURE: '/v1.0/price-test/:id/picture',
  },
}

export const VALIDATION = {
  password: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/,
  phone: /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/
}

export const PROJECT = {
  QUOTA: {
    MIN_POPULATION_WEIGHT: 0.5,
    MAX_POPULATION_WEIGHT: 1.5,
  }
}