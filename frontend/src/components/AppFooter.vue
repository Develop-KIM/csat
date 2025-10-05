<template>
  <v-footer app padless color="grey lighten-4" height="auto">
    <v-container>
      <v-row align="center" justify="space-between" class="py-3">
        <!-- 왼쪽: 저작권 & 버전 -->
        <v-col cols="12" md="auto" class="text-center text-md-left">
          <div class="text-caption">© 2025 CSAT Auto Trading</div>
          <div class="text-caption grey--text">Version {{ version }}</div>
        </v-col>

        <v-col
          cols="12"
          md="auto"
          class="text-center d-none d-md-flex align-center"
        >
          <v-chip outlined color="success" class="mr-2">
            <v-icon left>mdi-check-circle</v-icon>
            서비스 정상
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

        <v-col cols="12" md="auto" class="text-center text-md-right">
          <v-btn
            icon
            href="https://github.com/Develop-KIM/csat"
            target="_blank"
            title="GitHub Repository"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>

          <v-btn
            icon
            href="https://github.com/Develop-KIM/csat/releases"
            target="_blank"
            title="Release Notes"
          >
            <v-icon>mdi-tag</v-icon>
          </v-btn>

          <v-btn icon href="mailto:kimdonghwan913@gmail.com" title="Contact">
            <v-icon>mdi-email</v-icon>
          </v-btn>
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
      return (
        process.env.VUE_APP_VERSION || require("../../../package.json").version
      );
    },
  },
};
</script>
