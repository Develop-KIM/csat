import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import ko from "vuetify/es5/locale/ko";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: colors.indigo.darken1,
        secondary: colors.indigo.lighten4,
        accent: colors.purple.accent2,
        error: colors.red.accent3,
        info: colors.blue.base,
        success: colors.green.accent3,
        warning: colors.amber.base,
        profit: colors.green.accent4,
        loss: colors.red.accent4,
        neutral: colors.blueGrey.darken1,
      },
      dark: {
        primary: colors.indigo.lighten1,
        secondary: colors.indigo.darken3,
        accent: colors.purple.accent3,
        error: colors.red.accent2,
        info: colors.blue.lighten1,
        success: colors.green.accent2,
        warning: colors.amber.lighten1,
        profit: colors.green.accent3,
        loss: colors.red.accent3,
        neutral: colors.blueGrey.lighten1,
      },
    },
  },
  icons: {
    iconfont: "mdi",
  },
  breakpoint: {
    thresholds: {
      xs: 600,
      sm: 960,
      md: 1240,
      lg: 1920,
    },
  },
  lang: {
    locales: { ko },
    current: "ko",
  },
});
