import { all } from 'redux-saga/effects';
import getAdditionalBrands from './getAdditionalBrands';
import getBrandAssets from './getBrandAssets';
import getCustomQuestions from './getCustomQuestions';
import getEyeTrackingPacks from './getEyeTrackingPacks';
import getPacks from './getPacks';
import getPaymentSchedules from './getPaymentSchedules';
import getProject from './getProject';
import getProjectAttributes from './getProjectAttributes';
import getProjectBrands from './getProjectBrands';
import getTarget from './getTarget';
import getUserAttributes from './getUserAttributes';
import getVideos from './getVideos';
import getProjectRoles from './getProjectRoles'
import getPriceTest from './getPriceTest';

export const projectSagas = function* root() {
  yield all([
    getProject(),
    getPacks(),
    getAdditionalBrands(),
    getProjectAttributes(),
    getUserAttributes(),
    getCustomQuestions(),
    getEyeTrackingPacks(),
    getTarget(),
    getVideos(),
    getProjectBrands(),
    getBrandAssets(),
    getPaymentSchedules(),
    getProjectRoles(),
    getPriceTest(),
  ]);
};