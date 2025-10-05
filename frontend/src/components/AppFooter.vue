<template>
  <v-footer app padless color="grey lighten-4">
    <v-container class="py-4">
      <v-row
        v-if="$vuetify.breakpoint.mdAndUp"
        align="center"
        justify="space-between"
      >
        <v-col cols="auto">
          <div class="text-caption">© 2025 CSAT Auto Trading</div>
          <div class="text-caption grey--text">Version {{ version }}</div>
        </v-col>

        <v-col cols="auto">
          <div class="d-flex align-center">
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
          </div>
        </v-col>

        <v-col cols="auto">
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
                href="https://github.com/Develop-KIM/csat/releases"
                target="_blank"
              >
                <v-icon>mdi-tag</v-icon>
              </v-btn>
            </template>
            <span>Release Notes</span>
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

      <div v-else class="text-center">
        <div class="mb-3">
          <div class="text-caption">© 2025 CSAT Auto Trading</div>
          <div class="text-caption grey--text">Version {{ version }}</div>
        </div>

        <div>
          <v-btn
            icon
            small
            href="https://github.com/Develop-KIM/csat"
            target="_blank"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
          <v-btn
            icon
            small
            href="https://github.com/Develop-KIM/csat/releases"
            target="_blank"
          >
            <v-icon>mdi-tag</v-icon>
          </v-btn>
          <v-btn icon small href="mailto:kimdonghwan913@gmail.com">
            <v-icon>mdi-email</v-icon>
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter",

  computed: {
    version() {
      return process.env.VUE_APP_VERSION || "1.31.1";
    },
  },
};
</script>
