<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <span>조건검색 목록</span>
      <v-btn icon color="primary" :loading="loading" @click="fetchConditions">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>

    <v-tabs v-model="activeTab" grow>
      <v-tab>전체</v-tab>
      <v-tab>단타</v-tab>
      <v-tab>스윙</v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-card-text>
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-linear>

      <v-alert v-else-if="error" type="error" dismissible @input="error = null">
        {{ error }}
        <template v-slot:append>
          <v-btn small text @click="fetchConditions">재시도</v-btn>
        </template>
      </v-alert>

      <v-tabs-items v-else v-model="activeTab">
        <v-tab-item>
          <condition-list-content
            :conditions="allConditions"
            @select="handleSelect"
          />
        </v-tab-item>
        <v-tab-item>
          <condition-list-content
            :conditions="shortTermConditions"
            @select="handleSelect"
          />
        </v-tab-item>
        <v-tab-item>
          <condition-list-content
            :conditions="swingConditions"
            @select="handleSelect"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import { condition } from "@/api/condition";
import ConditionListContent from "./ConditionListContent.vue";

export default {
  name: "ConditionList",

  components: {
    ConditionListContent,
  },

  data() {
    return {
      conditions: [],
      activeTab: 0,
      selectedCondition: null,
      loading: false,
      error: null,
      shortTermIndexes: ["1", "2", "6", "8", "10"],
      swingIndexes: ["3", "4", "5", "7", "9", "11"],
    };
  },

  computed: {
    allConditions() {
      return this.conditions;
    },
    shortTermConditions() {
      return this.conditions.filter((c) =>
        this.shortTermIndexes.includes(c.index),
      );
    },
    swingConditions() {
      return this.conditions.filter((c) => this.swingIndexes.includes(c.index));
    },
  },

  mounted() {
    this.fetchConditions();
  },

  methods: {
    async fetchConditions() {
      this.loading = true;
      this.error = null;

      try {
        const response = await condition.getConditionList();
        this.conditions = response.data.data || [];
      } catch (err) {
        this.error = err.message || "조건검색 목록을 불러오는데 실패했습니다.";
        console.error("조건검색 목록 조회 실패:", err);
      } finally {
        this.loading = false;
      }
    },

    handleSelect(condition) {
      this.selectedCondition = condition;
      this.$emit("select", condition);
    },
  },
};
</script>
