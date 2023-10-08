<template>
  <b-row
    class="bg-app-green d-flex justify-content-center align-items-center py-2 py-md-4"
  >
    <router-link to="/">
      <b-img
        src="/logo-pluto.png"
        alt="Logo of PLUTO"
        fluid
        class="logo"
        :width="logoWidth"
      />
      <b-img
        src="/logo-digitize.png"
        alt="Logo of Digizize! Computational Social Sciences"
        fluid
        class="logo"
        :width="logoWidth"
      />
      <b-img
        src="/logo-uniwien.png"
        alt="Logo of the University of Vienna, Insitute of Political Sciences"
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

<style scoped>
.logo {
  margin: 0 0.5rem;
}
</style>
