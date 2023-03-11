<template>
<div>
  <b-row style="background-color: #d8ead2">
    <b-img src="/PLUTO_logo.png" alt="PLUTO logo" fluid class="logo" width="200" />
  </b-row>
  <b-row style="background-color: #f3f3f3">
    <div class="info-text" style="background-color: white; box-shadow: 4px 4px 4px #cccccc;">
      <h1 style="margin-bottom: 30px; color: #3e85c7">PLUTO - Public Value Assessment Tool </h1>

      <p>The risks and harms of digital data do not lie in the data themselves; they come from how the data is used. PLUTO is a tool for assessing the benefits and risks of specific instances of data use. The weighing of risks and benefits results in
        a score that indicates the public value of data use. </p>

      <p>PLUTO can be used by anyone wanting to know how much public value the use of data for a specific purpose generates: By companies, organisations, public bodies, or citizens. It asks 24 questions in four categories: </p>
      <ul>
        <li>Information about the data user</li>
        <li>Benefits of the data use</li>
        <li>Risks of the data use</li>
        <li>Institutional safeguards</li>
      </ul>
      <p>You do not need to have access to proprietary or any other highly specialised information to use this tool - but it is helpful to know the basic conditions
        under which data is used, and by whom. In a nutshell, the more a specific instance of data use benefits people and communities without putting individuals or groups at risk, the higher the public value. </p>

      <p>The developers of this tool are conscious that any attempt to provide a score pertaining to a complex concept such as public value comes with trade-offs. If you have any comments on how useful this tool has been for you, and how it could be
        improved, <a href="mailto:seliem.el-sayed@univie.ac.at">we would love to hear from you.</a> </p>


      <h4 style="margin-top: 50px">Information on how we use your data</h4>

      <p>The primary purpose of this tool is to provide data users and citizens information on how much public value specific instances of data use create. We, the tool developers, may use your (anonymised) data to improve the functionality of the
        PLUTO tool itself, and for our own research and publications relating to the development of the tool. We will only ever use de-identified information; no personal data will be processed. By using this tool you agree that we will process your
        data in this manner. For further information, please contact <a href="mailto:seliem.el-sayed@univie.ac.at">Seliem El-Sayed</a>. More information on how data will be used is available <a
          href="https://backend.univie.ac.at/fileadmin/user_upload/p_dsba/Uni_Wien_-_Allgemeine_Datenschutzerklaerung_V08_EN.pdf">here</a>.
      </p>
      <div id="startdiv">
        <b-button variant="primary" size="lg" id="startbutton" @click="$emit('startQuestionnaire')" >Start Questionnaire</b-button>
      </div>
      <div>
        <p class="developedText">This tool was developed by Seliem El-Sayed, Barbara Prainsack, Torsten Möller, Bernhard Jordan, Laura Koesten, and Péter Ferenc Gyarmati within the project <a href="https://digitize-transformation.at/en/">Digitize! Computational Social Science in digital and social
          transformation</a>, funded
          by the Austrian Federal Ministry of Education, Science and Research. </p>
      </div>
    </div>
  </b-row>
</div>
</template>

<script>
export default {
  name: 'StartView',
  components: {},
  props: {},
  data() {
    return {

    }
  },
  mounted() {},
  methods: {

  },
  computed: {},
}
</script>

<style>
.logo {
  max-width: 900px;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
}

#startdiv {
  margin: auto;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 80px;
}

.info-text {
  margin: auto;
  padding: 50px 30px 80px 30px;
  max-width: 800px;
  text-align: left;
}

.developedText {
  color: gray
}

#startbutton {
  background-color: #3e85c7
}
</style>
