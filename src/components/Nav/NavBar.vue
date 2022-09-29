<template>
  <v-app-bar
    flat
    fixed
    height="82"
    class="header layoutBackground"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.mdAndDown"
      @click.stop="$emit('change-sidebar')"
    />
    <router-link to="/" class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        :src="`/img/main/${logo}`"
        transition="scale-transition"
        :width="sizeLogo"
      />
    </router-link>
    <v-spacer></v-spacer>

    <div>
      <v-icon>mdi-account</v-icon>
      <span class="mr-2">{{ username }}</span>

      <v-menu
        transition="slide-y-reverse-transition"
        bottom
        right
        offset-y
      >
        <template v-slot:activator="{ on, value }">
          <!-- <v-btn
            v-bind="attrs"
            v-on="on"
          > -->
            <v-icon v-on="on" v-if="value">mdi-chevron-up</v-icon>
            <v-icon v-on="on" v-else>mdi-chevron-down</v-icon>
          <!-- </v-btn> -->
        </template>

        <v-list min-width="200px">
          <!-- <v-list-item link :to="'user-settings'">
            <v-list-item-title>Настройки</v-list-item-title>
          </v-list-item> -->
          <v-list-item link @click="$root.signOut">
            <v-list-item-title>Выход</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'NavBar',
  computed: {
    username() {
      return JSON.parse(localStorage.user).email || 'Пользователь';
    },
    logo() {
      return this.$vuetify.theme.dark ? 'logo-dark.png' : 'logo.svg';
    },
    sizeLogo() {
      return this.$vuetify.breakpoint.mdAndDown ? 129 : 199;
    }
  }
}
</script>
