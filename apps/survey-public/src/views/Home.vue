<template>
  <div class="home">
    <HeaderComponent />
    <div class="d-flex flex-column flex-grow-1">
      <main id="intro">
        <markdown-renderer :content="introContent" />
        <div class="start-btn-container">
          <b-button
            variant="primary"
            @click="startSurvey"
            :size="$mq === 'xs' || $mq === 'sm' ? 'md' : 'lg'"
            >Start survey</b-button
          >
        </div>
        <div class="flex-grow-1"></div>
        <footer id="contributors">
          <markdown-renderer :content="contributorsContent" />
        </footer>
      </main>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import HeaderComponent from '../components/Header.vue';
import MarkdownRenderer from '../components/MarkdownRenderer.vue';

export default Vue.extend({
  name: 'HomeView',
  components: {
    MarkdownRenderer,
    HeaderComponent,
  },
  computed: {
    $mq() {
      return this.$store.state.layout.screenSize;
    },
  },
  methods: {
    startSurvey() {
      this.$router.push('/survey');
    },
  },
  data() {
    return {
      introContent: `
      # PLUTO - Public Value Assessment Tool

      The risks and harms of digital data do not lie in the data itself; they come from how the data is used. PLUTO is a tool
      for assessing the benefits and risks of specific instances of data use. The weighing of risks and benefits results in a
      score that indicates the public value of data use.

      PLUTO can be used by anyone wanting to know how much public value the use of data for a specific purpose generates: By
      companies, organisations, public bodies, or citizens. It asks 24 questions in four categories:

      - Information about the data user
      - Benefits of the data use
      - Risks of the data use
      - Institutional safeguards

      You do not need to have access to proprietary or any other highly specialised information to use this tool - but it is
      helpful to know the basic conditions under which data is used, and by whom. In a nutshell, the more a specific instance
      of data use benefits people and communities without putting individuals or groups at risk, the higher the public value.

      The developers of this tool are conscious that any attempt to provide a score pertaining to a complex concept such as
      public value comes with trade-offs. If you have any comments on how useful this tool has been for you, and how it could
      be improved, [we would love to hear from you.](mailto:seliem.el-sayed@univie.ac.at)

      #### Information on how we use your data

      The primary purpose of this tool is to provide data users and citizens with information on how much public value
      specific instances of data use create. We, the tool developers, may use your (anonymised) data to improve the
      functionality of the PLUTO tool itself, and for our own research and publications relating to the development of the
      tool. We will only ever use de-identified information; no personal data will be processed. By using this tool you agree
      that we will process your data in this manner. For further information, please
      contact [Seliem El-Sayed](mailto:seliem.el-sayed@univie.ac.at). More information on how data will be used is
      available [here](https://backend.univie.ac.at/fileadmin/user_upload/p_dsba/Uni_Wien_-_Allgemeine_Datenschutzerklaerung_V08_EN.pdf).
      `.replace(/^[ \t]+/gm, ''),
      contributorsContent: `
      This tool was developed by Seliem El-Sayed, Barbara Prainsack, Torsten Möller, Bernhard Jordan, Laura Koesten, and Péter
      Ferenc Gyarmati within the
      project [Digitize! Computational Social Science in digital and social transformation](https://digitize-transformation.at/en/),
      funded by the Austrian Federal Ministry of Education, Science and Research.
      `.replace(/^[ \t]+/gm, ''),
    };
  },
});
</script>

<style lang="scss">
@import '../styles/bootstrap.scss';

.home {
  min-height: calc(100vh - 2rem);
  @extend .d-flex;
  @extend .flex-column;
}

#intro {
  @extend .flex-grow-1;
  @extend .d-flex;
  @extend .flex-column;
  @extend .align-items-center;
  @extend .shadow-lg;
  @extend .bg-white;
  @extend .text-justify;
  @extend .mx-auto;

  padding: 1rem 2.5rem;

  max-width: 800px;
  h1 {
    @extend .py-2;
    text-align: center;
    color: $primary;
  }

  .start-btn-container {
    margin: 0.5rem 0;
  }
}

#contributors {
  @extend .mt-5;
  color: gray;
  // smaller font size
  @extend .small;
}
</style>
