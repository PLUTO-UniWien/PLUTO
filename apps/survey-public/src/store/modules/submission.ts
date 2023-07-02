import { Module } from 'vuex';
import { RootState } from '../index';
import { ResultState } from './result';

export interface SubmissionState {
  submitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
}

const defaultState: SubmissionState = {
  submitting: false,
  submitSuccess: false,
  submitError: null,
};

const submission: Module<SubmissionState, RootState> = {
  namespaced: true,
  state: defaultState,
  mutations: {
    setSubmitting(state: SubmissionState, value: boolean) {
      state.submitting = value;
    },
    setSubmitSuccess(state: SubmissionState, value: boolean) {
      state.submitSuccess = value;
    },
    setSubmitError(state: SubmissionState, value: string | null) {
      state.submitError = value;
    },
  },
  actions: {
    async submitResult({ commit }, result: ResultState['result']) {
      commit('setSubmitting', true);
      commit('setSubmitSuccess', false);
      commit('setSubmitError', null);

      const response = await fetch('/api/survey/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        commit('setSubmitError', errorMessage);
      } else {
        commit('setSubmitSuccess', true);
      }

      commit('setSubmitting', false);
    },
  },
};

export default submission;
