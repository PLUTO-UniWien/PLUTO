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
    resetState(state) {
      Object.assign(state, defaultState);
    },
  },
  actions: {
    updateCurrentPage({ commit }, page: number) {
      commit('setCurrentPage', page);
    },
    updateInPreviewMode({ commit }, inPreviewMode: boolean) {
      commit('setInPreviewMode', inPreviewMode);
    },
    resetState({ commit }) {
      commit('resetState');
    },
  },
};

export default survey;
