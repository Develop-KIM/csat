<template>
  <v-footer app padless :color="footerColor">
    <v-container class="py-4">
      <v-row align="center" justify="space-between">
        <v-col md="auto" class="text-center footer-left">
          <div class="text-caption">© 2025 CSAT</div>
          <div class="text-caption grey--text">Version {{ version }}</div>
        </v-col>

        <v-col cols="auto" class="text-center d-none d-md-flex align-center">
          <v-chip outlined color="success" class="mr-2">
            <v-icon left>mdi-check-circle</v-icon>
            <span class="text-caption">서비스 정상</span>
          </v-chip>

          <v-divider vertical class="mx-2"></v-divider>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" class="d-flex align-center">
                <v-icon class="mr-1">mdi-vuejs</v-icon>
                <v-icon class="mr-1">mdi-nodejs</v-icon>
                <v-icon>mdi-database</v-icon>
              </div>
            </template>
            <span>Vue.js + Express + PostgreSQL</span>
          </v-tooltip>
        </v-col>

        <v-col md="auto" class="text-center footer-right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                href="https://github.com/Develop-KIM/csat"
                target="_blank"
              >
                <v-icon>mdi-github</v-icon>
              </v-btn>
            </template>
            <span>GitHub Repository</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                href="https://develop-kim.github.io/"
                target="_blank"
              >
                <v-icon>mdi-notebook-outline</v-icon>
              </v-btn>
            </template>
            <span>블로그</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                href="mailto:kimdonghwan913@gmail.com"
              >
                <v-icon>mdi-email</v-icon>
              </v-btn>
            </template>
            <span>Contact</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter",

  computed: {
    version() {
      return process.env.VUE_APP_VERSION;
    },
    footerColor() {
      return this.$vuetify.theme.dark ? "grey darken-4" : "grey lighten-4";
    },
  },
};
</script>

<style scoped>
@media (max-width: 960px) {
  .footer-left {
    text-align: left !important;
    margin-left: 8px;
  }

  .footer-right {
    text-align: right !important;
    margin-right: 8px;
  }
}
</style>
