<template>
  <b-row
    class="bg-app-green d-flex justify-content-center align-items-center py-2 py-md-4"
  >
    <b-img
      :src="require('../assets/logo.png')"
      alt="PLUTO logo"
      fluid
      class="logo"
      :width="logoWidth"
    />
  </b-row>
</template>

<script>
export default {
  name: 'HeaderComponent',
  computed: {
    logoWidth() {
      const mediaQuery = this.$store.state.layout.screenSize;
      switch (mediaQuery) {
        case 'xs':
          return 125;
        case 'sm':
          return 150;
        default:
          return 200;
      }
    },
  },
};
</script>
