<template>
  <b-row
    class="bg-app-green d-flex justify-content-center align-items-center py-2 py-md-4"
  >
    <router-link to="/">
      <b-img
        src="/logo.png"
        alt="PLUTO logo"
        fluid
        class="logo"
        :width="logoWidth"
      />
    </router-link>
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
