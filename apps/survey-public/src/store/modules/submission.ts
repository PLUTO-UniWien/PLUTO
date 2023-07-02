import { Module } from 'vuex';
import { RootState } from '../index';
import { ResultState } from './result';
import { apiFetch } from '../../utils/api.utils';
import { extractError } from '@pluto/utils';

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

      const response = await apiFetch(
        '/results',
        {},
        {
          method: 'POST',
          body: JSON.stringify(result),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await extractError(response);
        const errorMessage = JSON.stringify(error);
        commit('setSubmitError', errorMessage);
      } else {
        commit('setSubmitSuccess', true);
      }

      commit('setSubmitting', false);
    },
  },
};

export default submission;
