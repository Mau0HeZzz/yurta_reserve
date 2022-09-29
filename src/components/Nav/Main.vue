<template>
  <v-navigation-drawer
    :app="!$vuetify.breakpoint.mdAndDown"
    :absolute="!$vuetify.breakpoint.mdAndDown"
    :fixed="$vuetify.breakpoint.mdAndDown"
    clipped-left
    floating
    disable-route-watcher
    class="layoutBackground"
    height="auto"
    :value="isOpenMenu"
    :mini-variant="mini"
    :mobile-breakpoint="$vuetify.breakpoint.thresholds.md"
    @input="(val) => $emit('change-sidebar', val)"
  >
    <v-list flat>
      <template v-for="(item, i) in items">
        <v-list-item
          v-if="!item.children"
          :to="{ 'name': item.route }"
          :key="i"
          active-class="link--active"
          link
        >
          <v-list-item-icon>
            <v-img
              class="shrink"
              contain
              :src="item.icon"
              transition="scale-transition"
              height="20"
              width="20"
              :title="item.title"
            />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              exact
              class="link"
              v-text="item.title"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-else
          :key="i"
          no-action
          v-model="item.active"
          active-class="link--active"
        >
          <template v-slot:activator>
            <v-list-item-icon>
              <v-img
                class="shrink"
                contain
                :src="item.icon"
                transition="scale-transition"
                height="20"
                width="20"
                :title="item.title"
              />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                exact
                class="link"
                v-text="item.title"
              />
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="child in item.children"
            :key="child.route"
            :to="{ name: child.route }"
            active-class="link--active"
            link
            :exact="exact(child)"
          >
            <span :class="$style.square"></span>
            <v-list-item-content>
              <v-list-item-title
                :exact="exact(child)"
                class="link"
                v-text="child.title"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>
    <template v-slot:append>
      <div :class="$style.navigationBottom">
        <v-list-item
          v-if="!$vuetify.breakpoint.mdAndDown"
          @click.stop="mini = !mini"
        >
          <v-list-item-icon>
            <v-icon>{{ toggleIcon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Свернуть'"/>
          </v-list-item-content>
        </v-list-item>
        <div :class="$style.changeTheme">
          <v-btn
            icon
            tile
            large
            depressed
            @click="$emit('change-theme', !darkTheme)"
          >
            <v-icon>
              {{ themeIcon }}
            </v-icon>
          </v-btn>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import Cookies from "js-cookie";

const SIDEBAR_COOKIE = 'viewSidebar';
const SIDEBAR = {
  MIN: 'min',
  FILL: 'full',
};

export default {
  name: 'MainNav',
  props: {
    darkTheme: {
      type: Boolean,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      mini: false,
      items: [
        {
          icon: '/img/icons/li1.png',
          title: 'Плановые/аварийные отключения',
          route: 'Outages'
        },
        {
          icon: '/img/icons/li2.png',
          title: 'Дашборд теплоснабжение',
          route: 'Dashboard'
        },
        {
          icon: '/img/icons/li3.png',
          title: 'Список организаций',
          route: 'OrgList'
        },
        {
          icon: '/img/icons/li5.png',
          title: 'Энергоэффективность здания',
          route: 'EnergyEfficiency'
        },
        {
          icon: '/img/icons/li6.png',
          title: 'Карта здания',
          route: 'Realty'
        },
        {
          icon: '/img/icons/li7.png',
          title: 'Капитальный ремонт',
          active: true,
          children: [
            {
              title: 'Основной дашборд',
              route: 'Overhaul',
            },
            {
              title: 'Виды работ',
              route: 'JobsTypes',
            },
            {
              title: 'История размера взноса',
              route: 'ContributionHistory',
            },
            {
              title: 'Подъезды',
              route: 'Entrances',
            },
            {
              title: 'Собираемость взносов',
              route: 'CollectionRate',
            },
            {
              title: 'Дебиторская задолженность',
              route: 'AccountsReceivable',
            },
          ],
        },
        {
          icon: '/img/icons/li7.png',
          title: 'Дымоходы/вентканалы',
          route: 'Ventilation',
          active: true,
          children: [
            {
              title: 'Основной дашборд',
              route: 'VentilationСhimneys',
            },
            {
              title: 'Состояние систем вентиляции и дымоуправления',
              route: 'VentilationCondition',
              exact: false,
            }
          ],
        },
      ],
    }
  },
  created() {
    this.mini = Cookies.get(SIDEBAR_COOKIE) === SIDEBAR.MIN;
    this.openMenu();
  },
  computed: {
    isOpenMenu() {
      return this.$vuetify.breakpoint.lgAndUp || this.isOpen;
    },
    screenWidth() {
      return screen.width;
    },
    toggleIcon() {
      return this.mini ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left';
    },
    themeIcon() {
      return this.darkTheme ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent';
    },
  },
  watch: {
    mini(val) {
      Cookies.set(SIDEBAR_COOKIE, val ? SIDEBAR.MIN : SIDEBAR.FULL);
    }
  },
  methods: {
    exact: (item) =>item?.exact ?? true,
    openMenu() {
      this.items
        .filter(item => 'active' in item && item.children?.length > 0)
        .forEach(item => {
          item.active = this.$route.matched?.some(route => route.name === item.route);
        })
    }
  }
}
</script>

<style module>
.square {
  width: 10px;
  height: 10px;
  margin-right: 16px;
  border: 1px solid #118332;
  transform: rotate(45deg);
}

.navigationBottom {
  color: #858585;
}

.changeTheme {
  padding: 0 1px;
}
</style>
