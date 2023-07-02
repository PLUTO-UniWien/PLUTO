import { Module } from 'vuex';
import { RootState } from '../index';
import { ResultState } from './result';

export interface SurveyState {
  currentPage: number;
  inPreviewMode: boolean;
}

const defaultState: SurveyState = {
  currentPage: 0,
  inPreviewMode: false,
};

const survey: Module<SurveyState, RootState> = {
  namespaced: true,
  state: defaultState,
  mutations: {
    setCurrentPage(state, page: number) {
      state.currentPage = page;
    },
    setInPreviewMode(state, inPreviewMode: boolean) {
      state.inPreviewMode = inPreviewMode;
    },
  },
  actions: {
    updateCurrentPage({ commit }, page: number) {
      commit('setCurrentPage', page);
    },
    updateResult({ commit }, result: ResultState['result']) {
      commit('result/setResult', result, { root: true });
      // reset to default state
      commit('setCurrentPage', defaultState.currentPage);
      commit('setInPreviewMode', defaultState.inPreviewMode);
    },
    updateInPreviewMode({ commit }, inPreviewMode: boolean) {
      commit('setInPreviewMode', inPreviewMode);
    },
  },
};

export default survey;
