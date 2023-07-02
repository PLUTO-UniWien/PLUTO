import { Module } from 'vuex';
import { RootState } from '../index';
import { Store } from 'vuex';

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

type Breakpoint = keyof typeof breakpoints;

export interface LayoutState {
  screenSize: Breakpoint;
}

const layout: Module<LayoutState, RootState> = {
  namespaced: true,
  state: {
    screenSize: 'xs', // default screen size
  },
  mutations: {
    setScreenSize(state, size) {
      state.screenSize = size;
    },
  },
  actions: {
    updateScreenSize({ commit }) {
      const screenWidth = window.innerWidth;

      const keys = Object.keys(breakpoints) as Breakpoint[];
      let newSize = keys[keys.length - 1];

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const breakpoint = breakpoints[key];
        if (screenWidth < breakpoint) {
          newSize = keys[i - 1];
          break;
        }
      }

      commit('setScreenSize', newSize);
    },
  },
};

export function initLayoutListener(store: Store<RootState>) {
  window.addEventListener('resize', () => {
    store.dispatch('layout/updateScreenSize').catch(console.error);
  });
  store.dispatch('layout/updateScreenSize').catch(console.error);
}

export default layout;
