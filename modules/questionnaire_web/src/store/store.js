import Vue from 'vue'
import Vuex from 'vuex'
import calc from './calculations.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    result: ['Test'],
    totalScore: 0,
    axisScore: { x: 0, y: 0 },
    normalizedAxisScore: { x: 0, y: 0 },
    feedback: { risk: [], value: [] },
  },
  mutations: {
    saveResult(state, results) {
      state.result = results
      state.totalScore = calc.calculateTotalScore(results)
      state.axisScore = calc.calculateAxisScore(results)
      state.normalizedAxisScore = calc.calculateNormalizedAxisScore(results)
      state.feeback = calc.calculateFeedback(results)
    },
  },
  getters: {
    result: (state) => state.result,
    totalScore: (state) => state.totalScore,
    axisScore: (state) => state.axisScore,
    normalizedAxisScore: (state) => state.normalizedAxisScore,
    feedback: (state) => state.feeback,
  },
  actions: {},
})

export default store
