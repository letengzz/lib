import { defineStore } from "pinia";

export const collapseStore = defineStore("collapseStore", {
  // 真正存放数据的地方
  state() {
    return {
      collapse: false,
    };
  },
  getters: {
    getCollapse(state) {
      return state.collapse;
    },
  },
  actions: {
    setCollapse(collapse: boolean) {
      this.$state.collapse = collapse;
    },
  },
});
