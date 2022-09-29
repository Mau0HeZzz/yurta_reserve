<template>
  <v-container fill-height class="auth">
    <v-layout align-center justify-center mt5>
      <v-flex xs12 sm8 md4 lg3>
        <v-card class="elevation-12">
          <v-card-title class="justify-center">
            <h2 class="font-weight-medium">Авторизация</h2>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-form @submit.prevent="signIn">
              <v-text-field
                autofocus
                outlined
                required
                name="login"
                label="Логин"
                type="text"
                v-model="login"
                :rules="[() => (!!login && login.length >= 1) || 'Это поле обязательно']"
              ></v-text-field>
              <v-text-field
                outlined
                required
                name="password"
                label="Пароль"
                type="password"
                v-model="password"
                :rules="[() => (!!password && password.length >= 1) || 'Это поле обязательно']"
              ></v-text-field>
              <v-alert
                dense
                outlined
                type="error"
                v-show="errorMessage"
              >
                {{ errorMessage }}
              </v-alert>
              <v-col class="d-flex px-0">
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  color="primary"
                  class="text-capitalize"
                  type="submit"
                >
                  Войти
                </v-btn>
              </v-col>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import gql from 'graphql-tag';
import { onLogin } from '@/vue-apollo.js';

export default {
  name: 'Login',
  metaInfo: {
    title: 'Авторизация'
  },
  data: () => ({
    login: null,
    password: null,
    errorMessage: ''
  }),
  methods: {
    signIn() {
      this.$apollo.mutate({
        mutation: gql`mutation Mutation($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            user {
              id
              email
            }
          }
        }`,
        variables: {
          email: this.login,
          password: this.password
        },
      }).then(data => {
        onLogin(this.$apollo.provider.defaultClient, data.data.login.token);
        localStorage.isAuth = true;
        localStorage.user = JSON.stringify(data.data.login.user);
        this.$router.push('/');
      }).catch(() => {
        this.errorMessage = 'Неверный логин/пароль';
        // this.errorMessage = error.graphQLErrors[0].message;
      })
    }
  },
  mounted() {

  }
}
</script>
