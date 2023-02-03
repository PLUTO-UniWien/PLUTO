import Vue from 'vue';
import Vuex from 'vuex';
import calc from "./calculations.js"

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    result: ["Test"],
    totalScore: 0,
    axisScore: {x: 0, y: 0}
  },
  mutations: {
    saveResult(state, results){
      state.result = results
      state.totalScore = calc.calculateTotalScore(results)
      state.axisScore = calc.calculateAxisScore(results)
    }
  },
  getters: {
    result: (state) => state.result,
    totalScore: (state) => state.totalScore,
    axisScore: (state) => state.axisScore,
  },
  actions: {
  }
})

export default store;
