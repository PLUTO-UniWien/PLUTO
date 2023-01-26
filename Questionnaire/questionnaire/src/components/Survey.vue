<template>
  <div>
    <Survey :survey="survey" />
  </div>
</template>

<script>

// import * as d3 from 'd3';
import 'survey-core/defaultV2.min.css';
import json from '../assets/surveydefinition.json'
// StylesManager.applyTheme("defaultV2");
import { Survey } from 'survey-vue-ui';
import {Model } from 'survey-core';
const surveyJson = json

export default {
  name: 'SurveyView',
  components: {
    Survey
  },
  props: {
  },
  data() {
    const survey = new Model(surveyJson);
    return {
      survey
      // svgWidth: 0,
      // svgHeight: 500,
      // svgPadding: {
      //   top: 25, right: 20, bottom: 70, left: 40,
      // },
    }
  },
  mounted() {
    // this.drawChart();
  },
  methods: {
  },
  computed: {
    // disposablePersonaleIncome: {
    //   get() {
    //     return this.$store.getters.disposablePersonaleIncome;
    //   }
    // },
    // dataMax() {
    //   return d3.max(this.disposablePersonaleIncome, (d) => d.value);
    // },
    // dataMin() {
    //   return d3.min(this.disposablePersonaleIncome, (d) => d.value);
    // },
    // xScale() {
    //   return d3.scaleBand()
    //     .rangeRound([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right]).padding(0.1)
    //     .domain(this.disposablePersonaleIncome.map((d) => d.state));
    // },
    // yScale() {
    //   return d3.scaleLinear()
    //     .rangeRound([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0])
    //     .domain([this.dataMin > 0 ? 0 : this.dataMin, this.dataMax]);
    // },
  },
  // watch: {
  //   disposablePersonaleIncome: {
  //     handler() {
  //       this.drawChart();
  //     },
  //     deep: true,
  //   },
  // },
}
</script>

<style>

</style>
