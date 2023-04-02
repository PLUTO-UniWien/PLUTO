import Vue from 'vue'
import Vuex from 'vuex'
import calc from './calculations.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    result: [],
    transformedResultForServer: [],
    totalScore: 0,
    axisScore: { x: 0, y: 0 },
    normalizedAxisScore: { x: 0, y: 0 },
    feedback: { risk: [], value: [] },
    surveyJson: {},
  },
  mutations: {
    /**
     * Save the result of the survey
     * @param state
     * @param results {import('survey-core').IQuestionPlainData[]}
     */
    saveResult(state, results) {
      state.result = results
      state.transformedResultForServer = calc.transformResultToServerSideShape(
        state.surveyJson,
        results
      )
      state.totalScore = calc.calculateTotalScore(results)
      state.axisScore = calc.calculateAxisScore(results)
      state.normalizedAxisScore = calc.calculateNormalizedAxisScore(results)
      state.feedback = calc.calculateFeedback(results)
    },
    setSurveyJson(state, surveyJson) {
      state.surveyJson = surveyJson
    },
  },
  getters: {
    result: (state) => state.result,
    totalScore: (state) => state.totalScore,
    axisScore: (state) => state.axisScore,
    normalizedAxisScore: (state) => state.normalizedAxisScore,
    feedback: (state) => state.feedback,
    serverResult: (state) => ({
      choices: state.transformedResultForServer,
      totalScore: state.totalScore,
      axisScore: state.axisScore,
      normalizedAxisScore: state.normalizedAxisScore,
    }),
  },
  actions: {},
})

export default store
