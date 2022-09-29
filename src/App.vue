<template>
  <v-app v-if="!openRoutes.includes($route.name)">
    <NavBar @change-sidebar="isOpenSidebar = !isOpenSidebar" />

    <div class="content">
      <MainNav
        :darkTheme="darkTheme"
        :isOpen="isOpenSidebar"
        @change-sidebar="(val) => isOpenSidebar = val"
        @change-theme="changeTheme"
      />

      <v-main>
        <v-snackbar
          top
          right
          v-for="(snackbar, sbid) in $root.snackbars.filter(s => s.show)"
          v-model="snackbar.show"
          :key="sbid + Math.random()"
          :color="snackbar.type"
          :timeout="snackbar.time"
          :style="`top: ${sbid * 60}px`"
        >
          {{ snackbar.text }}
          <template v-slot:action="{ attrs }">
            <v-icon v-bind="attrs" @click="snackbar.show = false">mdi-close</v-icon>
          </template>
        </v-snackbar>

        <div class="mt-8 mb-4 ml-lg-6">
          <v-container class="rounded-l-lg col-12">
            <v-progress-linear
              :active="isLoading > 0"
              indeterminate
              color="primary"
            />
            <transition name="fade">
              <router-view @change-loading="handleChangeLoading"/>
            </transition>
          </v-container>
        </div>
      </v-main>
    </div>

    <Footer />
  </v-app>
  <v-app v-else>
    <router-view />
  </v-app>
</template>

<script>
import Cookies from 'js-cookie';
import MainNav from '@/components/Nav/Main.vue';
import NavBar from '@/components/Nav/NavBar.vue';
import Footer from '@/components/Nav/Footer.vue';
import { COOKIE_NAME, THEMES } from '@/plugins/vuetify';

export default {
  name: 'App',
  metaInfo: {
    title: 'АРМ',
    titleTemplate: '%s | АРМ "Власть"'
  },
  components: {
    MainNav,
    NavBar,
    Footer,
  },
  data: () => ({
    openRoutes: [
      'Login'
    ],
    isLoading: 0,
    isOpenSidebar: false,
  }),
  methods: {
    changeTheme(val) {
      this.$vuetify.theme.dark = val;
      Cookies.set(COOKIE_NAME, val ? THEMES.DARK : THEMES.LIGHT);
    },
    handleChangeLoading(pending) {
      this.isLoading = pending ? ++this.isLoading : --this.isLoading;
    }
  },
  computed: {
    darkTheme() {
      return this.$vuetify.theme.dark;
    },
  },
  watch: {
    $route() {
      this.isLoading = 0;
      this.isOpenSidebar = false;
    }
  }
};
</script>

<style lang="sass">
@import "./public/sass/style.sass"
</style>
