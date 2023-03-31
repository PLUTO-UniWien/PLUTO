<template>
  <div>
    <div class="background">
      <h2>This is your result</h2>
      <b-row style="padding-bottom: 60px; padding-top: 40px">
        <b-col>
          <div ref="chartarea" id="chartArea">
            <svg
              id="axisResultSvg"
              width="300"
              style="
                border-radius: 10px;
                margin: 10px;
                box-shadow: 3px 3px 6px #cccccc;
              "
            >
              <rect id="svgBackground" />
              <g id="chart">
                <g id="chartElements"></g>
                <g id="labels">
                  <text id="muchBenefit">High benefit</text>
                  <text id="littleBenefit">Low benefit</text>
                  <text id="lowRisk">Low risk</text>
                  <text id="highRisk">High risk</text>
                </g>
                <g id="pointGroup">
                  <circle id="resultPoint"></circle>
                </g>
              </g>
            </svg>
          </div>
        </b-col>
        <b-col>
          <div
            v-if="showResultsBotton"
            style="text-align: left; margin: auto"
            id="resultXarea"
          >
            <br />
            <h5 v-if="feedback.value.length">The benefits of the data use would be higher...</h5>
            <p v-for="(point, index) in feedback.value" :key="point + index">
              - {{ point }}
            </p>
            <h5 v-if="feedback.value.length">The risks would be lower...</h5>
            <p v-for="(point, index) in feedback.risk" :key="point + index">
              - {{ point }}
            </p>
            <br />
          </div>
        </b-col>
      </b-row>

      <div v-if="showScores">
        <br />
        Total Score: <br />
        {{ this.totalScore }}
        <br /><br />
        Axis Score: <br />
        x: {{ this.axisScore.x }}, y: {{ this.axisScore.y }}

        <br /><br />
        Normalized Axis Score: <br />
        x: {{ this.normalizedAxisScore.x }}, y:
        {{ this.normalizedAxisScore.y }} <br />
        <br />
      </div>

      <b-tooltip target="resultPoint" triggers="hover">
        Risk: {{ this.normalizedAxisScore.x.toFixed(2) }} <br />
        Benefit: {{ this.normalizedAxisScore.y.toFixed(2) }}
      </b-tooltip>

      <div v-if="showTooltips">
        <b-tooltip
          target="highPublicValue"
          triggers="hover"
          style="width: 300px"
          class="feedbackTooltip"
        >
          <b>You would have received a higher score: </b><br /><br />
          <ul>
            <li v-for="(point, index) in feedback.value" :key="point + index">
              {{ point }}
            </li>
          </ul>
        </b-tooltip>

        <b-tooltip target="lowRisk" triggers="hover" class="feedbackTooltip">
          <b>You would have received a higher score: </b><br /><br />
          <ul>
            <li v-for="(point, index) in feedback.risk" :key="point + index">
              {{ point }}
            </li>
          </ul>
        </b-tooltip>
      </div>
    </div>

    <b-row style="background-color: #ffffff">
      <div id="feedback">
        <h3 style="color: #3e85c7">About Public Value</h3>
        <p>
          The conception of public value underpinning this tool focuses on the
          sustainability of benefits, the extent to which these benefits address
          future societal needs, the distribution of benefits, the nature and
          severity of (conceivable) harm, the stability of safeguards, that is
          routine risk assessment prior to and during the deployment of the data
          use, and the possibility of correcting occurred harm swiftly and
          effectively. The public value is a weighted composite of risks and
          benefits of the data use.
        </p>

        <h4>High Public Value</h4>
        <p>
          If benefits are high and risks are low, this means that the data use
          that you inquired about creates high public value. It is likely to
          benefit people or communities without putting anyone at great risk.
          This means that the data use can (and often: should) go ahead. In some
          cases it means that it is so valuable that it
          <a
            href="https://www.thelancet.com/journals/landig/article/PIIS2589-7500(22)00189-3/fulltext"
          >
            should ideally receive public support
          </a>
          - e.g. in terms of funding, or by qualifying for regulatory
          exemptions. We cannot grant such support ourselves, but we hope that
          the high public value score can help you access it - if not now, then
          in the future, when public value receives more systematic
          consideration in legislation and regulation.
        </p>

        <h4>Medium Public Value</h4>
        <p>
          If benefits are high, but so are risks, this means that the data use
          that you inquired about creates some public value. It is likely to
          benefit people and communities but also puts some people at risk. In
          this case, the data use should only go ahead if the risks can be
          reduced to an acceptable level.
        </p>

        <h4>Low Public Value</h4>
        <p>
          If benefits are low, and so are risks, the data use in question
          creates low public value. Nevertheless, because the associated risks
          are low, it may go ahead if rules and practices are in place that
          ensure that some of the commercial profits obtained with the data come
          back to people and communities. You can find
          <a
            href="https://www.thelancet.com/journals/landig/article/PIIS2589-7500(22)00189-3/fulltext"
            >more information on benefit sharing here.</a
          >
        </p>

        <h4>No Public Value</h4>
        <p>
          If benefits are low and risks are high, the data use in question
          creates no public value. Such data use should not go ahead.
        </p>

        <h3 style="color: #3e85c7">Feedback</h3>
        <p>
          If you feel that this assessment is unfair and misses an important
          type of value that would be created by the data use,
          <a href="mailto:seliem.el-sayed@univie.ac.at">
            please let us know.
          </a>
        </p>
      </div>
    </b-row>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'ResultView',
  components: {},
  props: {},
  data() {
    return {
      svgPadding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
      showTooltips: false,
      showBackgroundColor: true,
      showResultsBotton: true,
      showScores: false,
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart() {
      let windowSize = 500
      try {
        windowSize =
          this.$refs.chartarea.clientWidth < 500
            ? this.$refs.chartarea.clientWidth
            : 500
      } catch {
        windowSize = 500
      }
      // let ticks = windowSize < 500 ? 4 : 8
      let radius = windowSize < 500 ? 4 : 8
      let chartsize = windowSize - this.svgPadding.top - this.svgPadding.bottom

      d3.select('#resultXarea').style('width', chartsize + 'px')

      const svg = d3.select('#axisResultSvg')

      svg.attr('width', windowSize).attr('height', windowSize)

      d3.select('#svgBackground')
        .attr('width', windowSize)
        .attr('height', windowSize)
        .attr('fill', 'white')

      // let chart = svg.append("g")
      d3.select('#chart').attr(
        'transform',
        'translate(' + this.svgPadding.left + ',' + this.svgPadding.top + ')'
      )

      d3.select('#lowRisk')
        .attr('x', -10)
        .attr('y', chartsize / 2 + 40)
        .attr('class', 'chartDesc')
        .attr('text-anchor', 'begin')

      d3.select('#muchBenefit')
        .attr('x', chartsize / 2 - 40)
        .attr('y', 5)
        .attr('class', 'chartDesc')
        .attr('text-anchor', 'end')

      d3.select('#highRisk')
        .attr('x', chartsize + 10)
        .attr('y', chartsize / 2 + 40)
        .attr('class', 'chartDesc')
        .attr('text-anchor', 'end')

      d3.select('#littleBenefit')
        .attr('x', chartsize / 2 - 40)
        .attr('y', chartsize)
        .attr('class', 'chartDesc')
        .attr('text-anchor', 'end')

      let scaleX = d3.scaleLinear().domain([1, -1]).range([0, chartsize])
      let axisX = d3.axisBottom().tickValues([-1, -0.5, 0.5, 1])
      // No labels on the X axis
      axisX.tickFormat('')

      let scaleY = d3.scaleLinear().domain([1, -1]).range([0, chartsize])
      let axisY = d3.axisLeft().tickValues([-1, -0.5, 0.5, 1])
      // No labels on the Y axis
      axisY.tickFormat('')

      axisX.scale(scaleX)
      d3.select('#chartElements')
        .append('g')
        .call(axisX)
        .attr('transform', 'translate(0,' + chartsize / 2 + ')')
        .attr('class', 'axis')

      axisY.scale(scaleY)
      d3.select('#chartElements')
        .append('g')
        .call(axisY)
        .attr('transform', 'translate(' + chartsize / 2 + ', 0)')
        .attr('class', 'axis')

      // chart.append("circle")
      d3.select('#resultPoint')
        .attr('r', radius)
        .attr('cx', scaleX(this.normalizedAxisScore.x))
        .attr('cy', scaleY(this.normalizedAxisScore.y))
        .attr('fill', '#3e85c7')
        .attr('id', 'resultPoint')
        .on('mouseover', () => {
          d3.select('#resultPoint')
            .transition()
            .duration(100)
            .attr('r', radius + 3)
        })
        .on('mouseout', () => {
          d3.select('#resultPoint').transition().duration(100).attr('r', radius)
        })

      // BACKGROUND COLOR

      if (this.showBackgroundColor == true) {
        let x = 200
        let opacity = 0.3
        let chartElements = d3.select('#chartElements')
        chartElements
          .append('rect')
          .attr('x', -x)
          .attr('y', -x)
          .attr('width', chartsize / 2 + x)
          .attr('height', chartsize / 2 + x)
          .attr('fill', '#7cc270')
          .style('opacity', opacity)

        chartElements
          .append('rect')
          .attr('x', chartsize / 2)
          .attr('y', -x)
          .attr('width', chartsize / 2 + x)
          .attr('height', chartsize / 2 + x)
          .attr('fill', '#f0cf60')
          .style('opacity', opacity)

        chartElements
          .append('rect')
          .attr('x', -x)
          .attr('y', chartsize / 2)
          .attr('width', chartsize / 2 + x)
          .attr('height', chartsize / 2 + x)
          .attr('fill', '#f0cf60')
          .style('opacity', opacity)

        chartElements
          .append('rect')
          .attr('x', chartsize / 2)
          .attr('y', chartsize / 2)
          .attr('width', chartsize / 2 + x)
          .attr('height', chartsize / 2 + x)
          .attr('fill', '#d85946')
          .style('opacity', opacity)
      }
    },
    drawResult() {},
  },
  computed: {
    result: {
      get() {
        return this.$store.getters.result
      },
    },
    totalScore: {
      get() {
        return this.$store.getters.totalScore
      },
    },
    axisScore: {
      get() {
        return this.$store.getters.axisScore
      },
    },
    normalizedAxisScore: {
      get() {
        return this.$store.getters.normalizedAxisScore
      },
    },
    feedback: {
      get() {
        return this.$store.getters.feedback
      },
    },
  },
  watch: {
    result: {
      handler() {
        this.drawChart()
        this.drawResult()
      },
      deep: true,
      immediate: true,
    },
    axisScore: {
      handler() {
        this.drawChart()
        this.drawResult()
      },
      deep: true,
      immediate: true,
    },
    totalScore(old, newone) {
      console.log(`We have ${newone} fruits now, yay!`)
    },
  },
}
</script>

<style>
.background {
  background-color: var(--background-dim, #f3f3f3);
}

p {
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip-inner {
  /* min-width: 450px; */
}

.axis {
  stroke-width: 2px;
  font-size: 12px;
  color: #505050;
  /* fill-opacity: 0.5; */
}

path {
  stroke: #505050;
}

line {
  stroke: #505050;
}

.chartDesc {
  font-size: 15px;
  fill: #505050;
}

#feedback {
  margin: auto;
  padding: 50px 30px 80px 30px;
  max-width: 800px;
  text-align: left;
  background-color: #ffffff;
}

a:link {
  color: #3e85c7;
}
</style>
