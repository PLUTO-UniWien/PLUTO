<template>
  <Survey :survey="survey" id="surveyElement"> </Survey>
</template>

<script>
import 'survey-core/defaultV2.min.css'

import { Survey } from 'survey-vue-ui'
import { StylesManager, Model, Serializer } from 'survey-core'
import { SURVEY_JSON } from '@/constants'
import { submitResult } from '@/services/response'
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
  },
  props: {},
  data() {
    const survey = new Model(SURVEY_JSON)
    survey.onComplete.add(this.surveyComplete)
    survey.onValidateQuestion.add(this.validateOnlyOptionsOrNoneIsSelected)
    survey.onAfterRenderQuestion.add(this.renderChoiceContentHTML)
    return {
      survey,
      // totalScore: 0,
      showResults: false,
      showStartView: true,
    }
  },
  mounted() {
    this.$store.commit('setSurveyJson', SURVEY_JSON)
  },
  methods: {
    /**
     *
     * @param surveyModel surveyModel {import('survey-core').SurveyModel}
     * @param event event {import('survey-core').CompleteEvent}
     */
    async surveyComplete(surveyModel, event) {
      event.showSaveInProgress()
      await new Promise((resolve) => setTimeout(resolve, 1000))

      /**
       * @type {import('survey-core').IQuestionPlainData[]}
       */
      const plainData = surveyModel.getPlainData({
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
      this.$store.commit('saveResult', plainData)

      // Persist the result to the server
      const serverResult = this.$store.getters.serverResult
      await submitResult(serverResult)
        .then(async () => {
          event.showSaveSuccess()
          await new Promise((resolve) => setTimeout(resolve, 1000))
        })
        .catch(async () => {
          event.showSaveError()
          await new Promise((resolve) => setTimeout(resolve, 1000))
        })

      // Navigate to the results page
      const href = '/result'
      this.$root.currentRoute = href
      window.history.pushState(null, '', href)
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
    /**
     * Makes it possible to define HTML content for choices in the survey JSON.
     * This callback injects the HTML content into the choice span elements.
     *
     * @param surveyModel {import('survey-core').SurveyModel}
     * @param event {import('survey-core').AfterRenderQuestionEvent}
     */
    renderChoiceContentHTML(surveyModel, event) {
      const choiceElements = event.htmlElement.querySelectorAll(
        '.sd-question__content .sv-string-viewer'
      )
      const choiceModels = event.question.choices
      choiceElements.forEach((choiceElement, i) => {
        const choiceModel = choiceModels[i]
        if (choiceModel) {
          choiceElement.innerHTML = choiceModel.text
        }
      })
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
