export default {

  calculateTotalScore(data) {
    let totalScore = 0
    data.forEach((item) => {
      if (Array.isArray(item.data)) {
        item.data.forEach((answer) => {
          if (answer.points)
            totalScore += answer.points
        });

      } else {
        if (item.data.points)
          totalScore += item.data.points
      }
    })
    return totalScore
  },

  calculateAxisScore(data) {
    let totalScore = {
      x: 0,
      y: 0
    }
    data.forEach((item) => {
      if (Array.isArray(item.data)) {
        item.data.forEach((answer) => {
          if (answer.points)
            if (answer.axis == "y")
              totalScore.y += answer.points
          else if (answer.axis == "x") {
            totalScore.x += answer.points
          } else console.error("Axis Score Calculation Error 1")
        });

      } else {
        if (item.data.points) {
          if (item.data.axis == "y")
            totalScore.y += item.data.points
          else if (item.data.axis == "x") {
            totalScore.x += item.data.points
          } else console.error("Axis Score Calculation Error 2")
        }
      }
    })
    console.log(totalScore)
    return totalScore
  }
}
