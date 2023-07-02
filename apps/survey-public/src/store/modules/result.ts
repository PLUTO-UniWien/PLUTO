import { Module } from 'vuex';
import { RootState } from '../index';

export interface ResultState {
  result: any;
}

const result: Module<ResultState, RootState> = {
  namespaced: true,
  state: {
    result: null,
  },
  mutations: {
    setResult(state, result: any) {
      state.result = result;
    },
  },
  actions: {
    updateResult({ commit }, result: any) {
      commit('setResult', result);
    },
  },
};

export default result;
