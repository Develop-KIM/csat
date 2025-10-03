<template>
  <v-btn icon @click="toggleTheme">
    <v-icon>{{ themeIcon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "ThemeToggle",

  computed: {
    themeIcon() {
      return this.$vuetify.theme.dark
        ? "mdi-white-balance-sunny"
        : "mdi-weather-night";
    },
  },

  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("darkMode", this.$vuetify.theme.dark);
    },
  },

  mounted() {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode !== null) {
      this.$vuetify.theme.dark = darkMode === "true";
    }
  },
};
</script>
