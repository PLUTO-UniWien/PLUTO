import { Module } from 'vuex';
import { RootState } from '../index';
import Cookies from 'js-cookie';
import { USER_JWT_COOKIE_NAME, UserLogin } from '@pluto/survey-model';
import { apiFetch } from '../../utils/api.utils';

const LOADING_TIMEOUT = 250;

export interface AuthState {
  isLoading: boolean;
  token: string | null;
  error: string | null;
}

const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state: {
    isLoading: true,
    token: window.localStorage.getItem(USER_JWT_COOKIE_NAME),
    error: null,
  },
  mutations: {
    setIsLoading(state, isLoading: AuthState['isLoading']) {
      state.isLoading = isLoading;
    },
    setToken(state, token: AuthState['token']) {
      state.token = token;
    },
    setError(state, error: AuthState['error']) {
      state.error = error;
    },
  },
  actions: {
    async login({ commit }, payload: UserLogin) {
      commit('setIsLoading', true);
      commit('setError', null);
      const res = await apiFetch(
        '/auth/login',
        {},
        {
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // Credentials valid, set token in state
      // The server sets the cookie `USER_JWT_COOKIE_NAME`, which is HTTP only,
      // so we just need to set the local storage item
      if (res.ok) {
        const { jwt: token } = await res.json();
        commit('setToken', token);
        window.localStorage.setItem(USER_JWT_COOKIE_NAME, token);
      }

      // Credentials invalid, set error in state
      if (!res.ok) {
        commit('setToken', null);
        commit(
          'setError',
          'Login failed. Please make sure your credentials are correct.'
        );
      }
      setTimeout(() => commit('setIsLoading', false), LOADING_TIMEOUT);
    },
    /**
     * It is not sufficient to have some token value set as a Cookie, it must be a valid token.
     * This action verifies the token using a server call.
     *
     * @param commit - Vuex commit function
     */
    async verifyToken({ commit }) {
      commit('setIsLoading', true);
      if (this.state.auth.token) {
        const res = await apiFetch('/auth/me', {});
        // Token invalid, set token in state to null, so that `isLoggedIn` returns false
        if (!res.ok) {
          commit('setToken', null);
          // remove cookie and local storage item
          Cookies.remove(USER_JWT_COOKIE_NAME);
          window.localStorage.removeItem(USER_JWT_COOKIE_NAME);
        }
      }
      setTimeout(() => commit('setIsLoading', false), LOADING_TIMEOUT);
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.token !== null;
    },
  },
};

export default auth;
