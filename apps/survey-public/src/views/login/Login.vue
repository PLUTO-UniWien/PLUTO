<template>
  <b-container class="min-vw-100">
    <header-component />
    <b-row align-h="center" class="mt-4">
      <b-col cols="8">
        <b-card title="Login">
          <b-alert
            v-if="error"
            variant="danger"
            :show="!!error"
            class="text-justify"
            >{{ error }}</b-alert
          >
          <b-form @submit.prevent="handleSubmit">
            <b-form-group
              id="identifierGroup"
              label="Username"
              label-for="identifier"
              class="text-left"
            >
              <b-form-input id="identifier" v-model="identifier" required />
            </b-form-group>
            <b-form-group
              id="passwordGroup"
              label="Password"
              label-for="password"
              class="text-left"
            >
              <b-form-input
                id="password"
                type="password"
                v-model="password"
                required
              />
            </b-form-group>
            <b-button type="submit" variant="primary">Login</b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';
import HeaderComponent from '../../components/Header.vue';

export default Vue.extend({
  name: 'LoginView',
  components: { HeaderComponent },
  data() {
    return {
      identifier: '',
      password: '',
    };
  },
  computed: {
    ...mapState('auth', ['error']),
  },
  methods: {
    ...mapActions('auth', ['login']),
    handleSubmit() {
      this.login({ identifier: this.identifier, password: this.password });
    },
  },
});
</script>

<style scoped></style>
