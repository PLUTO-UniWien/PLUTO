import * as d3 from 'd3'

/**
 @typedef {Object} Survey
 @property {string} title - The title of the PLUTO tool.
 @property {string} description - The description of the PLUTO tool.
 @property {string} showProgressBar - The position of the progress bar.
 @property {string} logo - The filename of the logo.
 @property {string} logoPosition - The position of the logo.
 @property {number} logoWidth - The width of the logo.
 @property {number} logoHeight - The height of the logo.
 @property {string} logoFit - The fit of the logo.
 @property {string} completedHtml - The HTML displayed when the PLUTO tool is completed.
 @property {Object[]} completedHtmlOnCondition - An array of objects that contain HTML displayed conditionally.
 @property {string} completedHtmlOnCondition[].html - The HTML displayed conditionally.
 @property {Object[]} pages - An array of pages.
 @property {string} pages[].name - The name of the page.
 @property {string} pages[].title - The title of the page.
 @property {string} pages[].description - The description of the page.
 @property {Object[]} pages[].elements - An array of elements.
 @property {string} pages[].elements[].type - The type of the element.
 @property {string} pages[].elements[].name - The name of the element.
 @property {string} pages[].elements[].title - The title of the element.
 @property {boolean} pages[].elements[].isRequired - Whether the element is required.
 @property {Object[]} pages[].elements[].choices - An array of choices.
 @property {string} pages[].elements[].choices[].value - The value of the choice.
 @property {string} pages[].elements[].choices[].text - The text of the choice.
 @property {number} pages[].elements[].choices[].points - The points awarded for choosing the choice.
 @property {string} pages[].elements[].choices[].axis - The axis of the choice.
 @property {string} pages[].elements[].choices[].feedback - The feedback for choosing the choice.
 @property {boolean} pages[].elements[].separateSpecialChoices - Whether special choices are separated.
 @property {boolean} pages[].elements[].showNoneItem - Whether to show the none item.
 @property {string} pages[].elements[].noneText - The text of the none item.
 @property {number} pages[].elements[].maxSelectedChoices - The maximum number of selected choices.
 @property {string} showQuestionNumbers - Whether to show question numbers.
 */

export default {
  /**
   * Calculate the normalized result, ready to be used by a server
   * @param surveyJson {Survey}
   * @param data {import('survey-core').IQuestionPlainData[]}
   */
  transformResultToServerSideShape(surveyJson, data) {
    return data
  },
  /**
   * @param data {import('survey-core').IQuestionPlainData[]}
   * @return {number}
   */
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

  /**
   * @param data {import('survey-core').IQuestionPlainData[]}
   * @return {{x: number, y: number}}
   */
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
  /**
   * @param data {import('survey-core').IQuestionPlainData[]}
   * @return {{x: number, y: number}}
   */
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

    return normalized
  },
  /**
   * @param data {import('survey-core').IQuestionPlainData[]}
   * @return {{risk: string[], value: string[]}}
   */
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
