PLUTO_logo

###This app uses the following setup:
vue.js - https://vuejs.org/
Bootstrap - https://bootstrap-vue.org/
SurveyJS - https://surveyjs.io/
Vuex - https://vuex.vuejs.org/
D3 Version 6.7 - https://d3js.org/

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
yarn run build
```

### This project consists of three parts/views:

#### Survey.vue
This is the main View, here is also the Start and the Result View embedded. Here, the surveydefinition.json file is loaded where all the information and definition of the survey lies. So all changes to the survey should be done here. More information can be found here: https://surveyjs.io/create-free-survey
The results are then calculated and safed in the surveyComplete()-function. There are 2 options to access these survey results:
sender.data
sender.getPlainData

#### Start.vue
Here the landing page is defined. Nothing speciual here.

#### Result.vue
The graph is done with d3. The calculations of the points are done in store/calculations.js
The result isn't saved persistantly and there is also no backend. This is still a TODO.


#### store/calculations.js
The calculation of the points is done here, where calculateAxisScore() adds up the point of each axis.
calculateNormalizedAxisScore() normalizes these points, but normalizes ranges from [-51,0] to [-1,0] and [0,23] to [0,1].
The function calculateFeedback(data) checks if a feedbackmessage should be printed to the user and saves it in an array.

If you have questions, please write an email: mail@bernhardjordan.space
