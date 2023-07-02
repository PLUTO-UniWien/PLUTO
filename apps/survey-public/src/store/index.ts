import Vue from 'vue';
import Vuex from 'vuex';
import layout, { LayoutState } from './modules/layout';
import survey, { SurveyState } from './modules/survey';
import result, { ResultState } from './modules/result';
import submission, { SubmissionState } from './modules/submission';
import auth, { AuthState } from './modules/auth';

Vue.use(Vuex);

export interface RootState {
  layout: LayoutState;
  survey: SurveyState;
  result: ResultState;
  submission: SubmissionState;
  auth: AuthState;
}

const store = new Vuex.Store({
  modules: {
    layout,
    survey,
    result,
    submission,
    auth,
  },
});

export default store;
