import { defineStore } from "pinia";
// 自定义一个选项卡数据类
export interface Tab {
  title: string
  path: string
}
// 自定义数组的数据类型
export interface TabState {
  tabList: Tab[]
}

export const tabStore = defineStore("tabStore", {
  // 真正存放数据的地方
  state: (): TabState => {
    // 定义
    return {
      tabList: [],
    };
  },
  getters: {
    getTab(state) {
      return state.tabList;
    },
  },
  actions: {
    addTab(tab: Tab) {
      // 判断当前tabList中是否存在选项卡里面
      if (this.tabList.some(item => item.path === tab.path)) {
        return;
      }
      if (tab.path === "/dashboard") {
        // 如果是首页加到第一个
        this.tabList.unshift(tab);
      }
      else {
        this.tabList.push(tab);
      }
    },
  },
  persist: [
    {
      pick: ["tabList"], // 指定字段
      storage: localStorage, // 存储方式
    },
  ],
});
