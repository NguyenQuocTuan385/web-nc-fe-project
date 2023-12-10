import produce from 'immer';
import _ from 'lodash';
import { CreateProjectRedirect, Project } from 'models/project';
import * as types from './actionTypes';

export interface ProjectState {
  createProjectRedirect?: CreateProjectRedirect,
  project?: Project,
  cancelPayment?: boolean,
  scrollToSection?: string,
  showHowToSetup?: boolean,
  triggerValidate?: number
}

const initial: ProjectState = {
  createProjectRedirect: null,
  project: null,
  cancelPayment: false,
  scrollToSection: null,
  showHowToSetup: false,
  triggerValidate: 0
}

export const projectReducer = (state = initial, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case types.SET_PROJECT_REDUCER:
        if (action.data && !_.isEmpty(action.data)) {
          draft.project = {
            ...draft.project,
            ...action.data
          };
        } else {
          draft.project = null
        }
        break;
      case types.SET_CREATE_PROJECT_REDIRECT_OF_PROJECT_REDUCER:
        draft.createProjectRedirect = action.data;
        break;
      case types.SET_CANCEL_PAYMENT_REDUCER:
        draft.cancelPayment = action.data;
        break;
      case types.SET_PACKS_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          packs: action.data
        };
        break;
      case types.SET_ADDITIONAL_BRANDS_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          additionalBrands: action.data
        };
        break;
      case types.SET_USER_ATTRIBUTES_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          userAttributes: action.data
        };
        break;
      case types.SET_PROJECT_ATTRIBUTES_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          projectAttributes: action.data
        };
        break;
      case types.SET_CUSTOM_QUESTIONS_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          customQuestions: action.data
        };
        break;
      case types.SET_EYE_TRACKING_PACKS_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          eyeTrackingPacks: action.data
        };
        break;
      case types.SET_TARGET_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          targets: action.data
        };
        break;
      case types.SET_PROJECT_ROLES:
        draft.project = {
          ...draft.project,
          projectUsers: action.data
        };
        break;
      case types.SET_VIDEOS_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          videos: action.data
        };
        break;
      case types.SET_SCROLL_TO_SECTION_OF_PROJECT_REDUCER:
        draft.scrollToSection = action.data
        break;
      case types.SET_HOW_TO_SETUP_SURVEY_REDUCER:
        draft.showHowToSetup = action.data
        break;
      case types.SET_PROJECT_BRANDS_REDUCER:
        draft.project = {
          ...draft.project,
          projectBrands: action.data
        };
        break;
      case types.SET_BRAND_ASSETS_REDUCER:
        draft.project = {
          ...draft.project,
          brandAssets: action.data
        };
        break;
      case types.SET_PAYMENT_SCHEDULES_REDUCER:
        draft.project = {
          ...draft.project,
          paymentSchedules: action.data
        };
        break;
      case types.SET_PRICE_TEST_REDUCER:
        draft.project = {
          ...draft.project,
          priceTest: action.data
        };
        break;
      case types.SET_TRIGGER_VALIDATE_REDUCER:
        draft.triggerValidate = (draft.triggerValidate ?? 0) + 1
        break;
      case types.REFRESH_TRIGGER_VALIDATE_REDUCER:
          draft.triggerValidate = 0
          break;
      default:
        return state;
    }
  })
