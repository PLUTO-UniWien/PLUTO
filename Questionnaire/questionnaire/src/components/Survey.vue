<template>
  <div>
    <Survey :survey="survey"> </Survey>

    <!-- <b-modal id="resultmodal" title="BootstrapVue">
   <p class="my-4">Your score is {{this.totalScore}}</p>
  </b-modal> -->
  <ResultView v-if="showResults"/>
  </div>

</template>

<script>

// import * as d3 from 'd3';
import ResultView from './Result.vue'
import 'survey-core/defaultV2.min.css';
import json from '../assets/surveydefinition_test.json'
import { Survey } from 'survey-vue-ui';
import { StylesManager, Model, Serializer} from 'survey-core';
StylesManager.applyTheme("defaultV2");
const surveyJson = json
Serializer.addProperty("itemvalue", {
    name: "points:number"
  });
Serializer.addProperty("itemvalue", {
    name: "axis:string"
  });

export default {
  name: 'SurveyView',
  components: {
    Survey,
    ResultView
  },
  props: {
  },
  data() {
    const survey = new Model(surveyJson);
    survey.onComplete.add(this.surveyComplete);
    return {
      survey,
      // totalScore: 0,
      showResults: false
    }
  },
  mounted() {
  },
  methods: {
    surveyComplete (sender) {
      console.log("RESULT DATA:")
      console.log(JSON.stringify(sender.data, null, 3))
      const plainData = sender.getPlainData({
       // Include `score` values into the data array
       calculations: [{ propertyName: "points" }, { propertyName: "axis" }]
     });
     console.log(plainData)
     // this.calculateTotalScore(plainData);
     console.log(this.totalScore)
     // this.$bvModal.show("resultmodal")
     this.showResults = true;
     this.$store.commit('saveResult', plainData);
     console.log(this.$store.getters.result)
     // window.location.href = "http://stackoverflow.com";
   }
  },
  computed: {
  },
}
</script>

<style>

</style>
