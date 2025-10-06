<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="4">
        <condition-list
          @select="handleConditionSelect"
          @apply="handleConditionApply"
        />
      </v-col>

      <v-col cols="12" md="8">
        <v-card v-if="selectedCondition">
          <v-card-title> 선택된 조건 </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>조건 이름</v-list-item-subtitle>
                    <v-list-item-title class="text-h6">
                      {{ selectedCondition.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>조건 인덱스</v-list-item-subtitle>
                    <v-list-item-title>
                      {{ selectedCondition.index }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card v-else>
          <v-card-text class="text-center py-12">
            <v-icon size="64" color="grey lighten-1">mdi-strategy</v-icon>
            <p class="text-h6 grey--text text--lighten-1 mt-4">
              조건을 선택해주세요
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ConditionList from "@/components/ConditionList.vue";

export default {
  name: "ConditionSearch",

  components: {
    ConditionList,
  },

  data() {
    return {
      selectedCondition: null,
    };
  },

  methods: {
    handleConditionSelect(condition) {
      this.selectedCondition = condition;
      console.log("조건 선택됨:", condition);
    },

    handleConditionApply(condition) {
      console.log("조건 적용:", condition);
      this.$store.dispatch("applyCondition", condition);
    },
  },
};
</script>
