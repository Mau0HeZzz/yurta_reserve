import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ru from 'vuetify/lib/locale/ru';
// import colors from 'vuetify/lib/util/colors'
import Cookies from 'js-cookie';

Vue.use(Vuetify);

export const COOKIE_NAME = 'theme';
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
}

export default new Vuetify({
  theme: {
    dark: Cookies.get(COOKIE_NAME) !== THEMES.LIGHT,
    green: true,
    options: {
      customProperties: true,
      variations: false,
    },
    themes: {
      light: {
        background: '#FF0000',
        base: '#118332',
        primary: '#118332',
        secondary: '#E7F3EB',
        accent: '#118332',
        anchor: '#E7F3EB',
        dividerBackground: '#000000',
        layoutBackground: '#FFFFFF',
        linkActiveColor: '#232323',
        content: '#F2F3F9',
        container: '#FFFFFF',
        unit: '#FFFFFF',
        unitHover: '#FFFFFF',
        unitNoHover: '#FFFFFF',
        chartsTitle: '#232323',
        tableRow: '#F9F9F9',
        ventilationTitle: '#000',
        ventilationSubTitle: '#232323',
        checkboxLabel: '#202020',
        checkboxSVG: 'white',
        selectLabel: '#000',
        selectBG: '#FCFCFC',
        selectBorder: '#E4E4E4',
        selectDropdown: '#FFF',
        selectItem: '#7B7B7B',
        selectItemActive: '17, 131, 50',
        selectDivider: '#E2E2E2',
        selectShadow: '150, 150, 150, 0.11',
        inputBG: '#FCFCFC',
        inputBorder: '#E4E4E4',
        inputLabel: '#000',
        inputColor: '#7B7B7B',
        inputIcon: '#D6D6D6',
      },
      dark: {
        dividerBackground: '#FFFFFF',
        layoutBackground: '#21222D',
        linkActiveColor: '#E2E2E2',
        content: '#0b0c19',
        container: '#171821',
        unit: '#21222D',
        unitHover: '#32333A',
        unitNoHover: '#1C1D27',
        chartsTitle: '#E2E2E2',
        tableRow: '#22232F',
        ventilationTitle: '#FFF',
        ventilationSubTitle: '#E2E2E2',
        checkboxLabel: '#E2E2E2',
        checkboxSVG: 'black',
        selectBG: '#21222D',
        selectBorder: '#48485A',
        selectLabel: '#FFF',
        selectDropdown: '#21222D',
        selectItem: '#E2E2E2',
        selectItemActive: '17, 131, 50',
        selectDivider: '#48485A',
        selectShadow: '150, 150, 150, 0',
        inputBG: '#21222D',
        inputBorder: '#48485A',
        inputLabel: '#FFF',
        inputColor: '#D6D6D6',
        inputIcon: '#48485A',
      }
    },
  },
  lang: {
    locales: { ru },
    current: 'ru'
  }
});
