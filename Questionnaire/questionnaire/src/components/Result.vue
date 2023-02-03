<template>
  <div class="background">

    Total Score: <br>
    {{this.totalScore}}
<br><br>
    Axis Score: <br>
    x: {{this.axisScore.x}}, y: {{this.axisScore.y}}
    <br> <br>
    <div ref="chartarea">
    <svg id="axisResultSvg" width="300" >
      <!-- <rect width="300" height="300" fill="gray"/> -->
    </svg>
  </div>
  </div>
</template>

<script>

import * as d3 from 'd3'

export default {
  name: 'ResultView',
  components: {
  },
  props: {
  },
  data() {
    return {
      svgPadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }
      }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart(){
      console.log("Draw Chart")

      let windowSize = this.$refs.chartarea.clientWidth
      if(windowSize < 500) this.$refs.chartarea.clientWidth
      else windowSize = 500

      let ticks =  windowSize < 500 ? 4 : 6
      let radius =  windowSize < 500 ? 4 : 8
      let chartsize = windowSize - this.svgPadding.top - this.svgPadding.bottom

      const svg = d3.select("#axisResultSvg")

      svg.attr("width", windowSize)
        .attr("height", windowSize)

      svg.append("rect")
        .attr("width", windowSize)
        .attr("height", windowSize)
        .attr("fill","white")

      let chart = svg.append("g")
        .attr("transform","translate(" + this.svgPadding.left + "," + this.svgPadding.top + ")")

      let scaleX = d3.scaleLinear()
        .domain([-100, 100])
        .range([0, chartsize]);
      let axisX = d3.axisBottom().ticks(ticks)
      axisX.scale(scaleX)
      chart.append("g").call(axisX)
        .attr("transform","translate(0," + (chartsize/2) + ")")

      let scaleY = d3.scaleLinear()
        .domain([100, -100])
        .range([0, chartsize]);
      let axisY = d3.axisLeft().ticks(ticks)
      axisY.scale(scaleY)
      chart.append("g").call(axisY)
        .attr("transform","translate(" + (chartsize/2) + ", 0)")

      chart.append("circle")
        .attr("r", radius)
        .attr("cx", scaleX(40))
        .attr("cy", scaleY(40))
        .attr("fill", "steelblue")
    },
    drawResult(){

    }
  },
  computed: {
    result : {
      get() {
        return this.$store.getters.result
      }
    },
    totalScore : {
      get() {
        return this.$store.getters.totalScore
      }
    },
    axisScore : {
      get() {
        return this.$store.getters.axisScore
      }
    }
  },
  watch: {
    result: {
        handler() {
          this.drawChart();
          this.drawResult();
        },
        deep: true,
         immediate: true,
      },
      axisScore: {
          handler() {
            this.drawChart();
            this.drawResult();
          },
          deep: true,
           immediate: true,
        },
        totalScore(old, newone){
          console.log(`We have ${newone} fruits now, yay!`)
        }
  }
}
</script>

<style>

.background{
  background-color: var(--background-dim, #f3f3f3)
}

</style>
