import * as d3 from 'd3'

export default {
  calculateTotalScore(data) {
    let totalScore = 0
    data.forEach((item) => {
      if (Array.isArray(item.data)) {
        item.data.forEach((answer) => {
          if (answer.points) totalScore += answer.points
        })
      } else {
        if (item.data.points) totalScore += item.data.points
      }
    })
    return totalScore
  },

  calculateAxisScore(data) {
    let totalScore = {
      x: 0,
      y: 0,
    }
    data.forEach((item) => {
      if (Array.isArray(item.data)) {
        item.data.forEach((answer) => {
          if (answer.points)
            if (answer.axis == 'y') totalScore.y += answer.points
            else if (answer.axis == 'x') {
              totalScore.x += answer.points
            } else console.error('Axis Score Calculation Error 1')
        })
      } else {
        if (item.data.points) {
          if (item.data.axis == 'y') totalScore.y += item.data.points
          else if (item.data.axis == 'x') {
            totalScore.x += item.data.points
          } else console.error('Axis Score Calculation Error 2')
        }
      }
    })
    return totalScore
  },
  calculateNormalizedAxisScore(data) {
    let score = this.calculateAxisScore(data)

    let normalizeXminus = d3.scaleLinear().domain([-51, 0]).range([-1, 0])

    let normalizeXplus = d3.scaleLinear().domain([0, 23]).range([0, 1])

    let normalizeYminus = d3.scaleLinear().domain([-9, 0]).range([-1, 0])

    let normalizeYplus = d3.scaleLinear().domain([0, 17]).range([0, 1])

    // let normalize = d3.scaleLinear()
    // .domain([-60,40])
    // .range([-100,100]);

    let normalized = {
      x: score.x < 0 ? normalizeXminus(score.x) : normalizeXplus(score.x),
      y: score.y < 0 ? normalizeYminus(score.y) : normalizeYplus(score.y),
    }
    console.log(normalized)
    return normalized
  },
  calculateFeedback(data) {
    let feedback = { risk: [], value: [] }

    data.forEach((item) => {
      if (Array.isArray(item.data)) {
        item.data.forEach((answer) => {
          if (answer.feedback) {
            if (answer.axis == 'y') {
              if (feedback.value.indexOf(answer.feedback) === -1) {
                feedback.value.push(answer.feedback)
              }
            } else if (answer.axis == 'x') {
              if (feedback.risk.indexOf(answer.feedback) === -1) {
                feedback.risk.push(answer.feedback)
              }
            } else console.error('Feedback Calculation Error 1', answer.axis)
          }
        })
      } else {
        if (item.data.points) {
          if (item.data.axis == 'y')
            if (feedback.value.indexOf(item.data.feedback) === -1) {
              feedback.value.push(item.data.feedback)
            } else if (item.data.axis == 'x') {
              if (feedback.value.indexOf(item.data.feedback) === -1) {
                feedback.value.push(item.data.feedback)
              }
            } else console.error('Feedback Calculation Error 2')
        }
      }
    })

    return feedback
  },
}
