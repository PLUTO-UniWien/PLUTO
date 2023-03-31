<template>
  <div>
    <div v-if="showStartView">
      <StartView @startQuestionnaire="showStartView = false" />
    </div>
    <div v-if="!showStartView">
      <Survey :survey="survey" id="surveyElement"> </Survey>
      <ResultView v-if="showResults" />
    </div>
  </div>
</template>

<script>
// import * as d3 from 'd3';
import ResultView from './Result.vue'
import StartView from './Start.vue'
import 'survey-core/defaultV2.min.css'
import surveyJson from '../assets/surveydefinition.json'
import { Survey } from 'survey-vue-ui'
import { StylesManager, Model, Serializer } from 'survey-core'
StylesManager.applyTheme('defaultV2')
Serializer.addProperty('itemvalue', {
  name: 'points:number',
})
Serializer.addProperty('itemvalue', {
  name: 'axis:string',
})
Serializer.addProperty('itemvalue', {
  name: 'feedback:string',
})

export default {
  name: 'SurveyView',
  components: {
    Survey,
    ResultView,
    StartView,
  },
  props: {},
  data() {
    const survey = new Model(surveyJson)
    survey.onComplete.add(this.surveyComplete)
    survey.onValidateQuestion.add(this.validateOnlyOptionsOrNoneIsSelected)
    return {
      survey,
      // totalScore: 0,
      showResults: false,
      showStartView: true,
    }
  },
  mounted() {},
  methods: {
    surveyComplete(sender) {
      console.log('RESULT DATA:')
      console.log(JSON.stringify(sender.data, null, 2))
      const plainData = sender.getPlainData({
        // Include `score` values into the data array
        calculations: [
          {
            propertyName: 'points',
          },
          {
            propertyName: 'axis',
          },
          {
            propertyName: 'feedback',
          },
        ],
      })
      console.log(plainData)
      // this.calculateTotalScore(plainData);
      console.log(this.totalScore)
      // this.$bvModal.show("resultmodal")
      this.showResults = true
      this.$store.commit('saveResult', plainData)
      console.log(this.$store.getters.result)
      // window.location.href = "http://stackoverflow.com";
    },
    validateOnlyOptionsOrNoneIsSelected(survey, options) {
      const isCheckbox = options.question.getType() === 'checkbox'
      if (isCheckbox) {
        /** @type {string[]} */
        const selection = options.value
        const noneOfTheAboveOptionSelected = selection.includes('other')
        if (noneOfTheAboveOptionSelected && selection.length > 1) {
          options.error =
            'You cannot select other options when selecting "None of the above".'
        }
      }
    },
  },
  computed: {},
}
</script>

<style>
#surveyElement {
  --primary: #3e85c7;
  --background: #ffffff;
  --background-dim: #f3f3f3;
  --background-dim-light: #f9f9f9;
  --primary-foreground: #ffffff;
  --foreground: #161616;
  --base-unit: 8px;
}
</style>
