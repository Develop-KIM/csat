<template>
  <div class="d-flex align-center">
    <v-icon
      :small="$vuetify.breakpoint.smAndDown"
      :class="$vuetify.breakpoint.smAndDown ? 'mr-2' : 'mr-3'"
    >
      {{ isDark ? "mdi-weather-night" : "mdi-white-balance-sunny" }}
    </v-icon>
    <div
      class="toggle-switch"
      :class="{
        active: isDark,
        'toggle-switch-small': $vuetify.breakpoint.smAndDown,
      }"
      @click="toggleTheme"
    >
      <div class="toggle-slider"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ThemeToggle",

  data() {
    return {
      isDark: false,
    };
  },

  mounted() {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode !== null) {
      this.isDark = darkMode === "true";
      this.$vuetify.theme.dark = this.isDark;
    }
  },

  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      this.$vuetify.theme.dark = this.isDark;
      localStorage.setItem("darkMode", this.isDark);
    },
  },
};
</script>

<style scoped>
.toggle-switch {
  position: relative;
  width: 52px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-switch-small {
  width: 40px;
  height: 22px;
  border-radius: 11px;
}

.toggle-switch.active {
  background-color: var(--v-success-base);
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch-small .toggle-slider {
  width: 18px;
  height: 18px;
}

.toggle-switch.active .toggle-slider {
  transform: translateX(24px);
}

.toggle-switch-small.active .toggle-slider {
  transform: translateX(18px);
}
</style>
