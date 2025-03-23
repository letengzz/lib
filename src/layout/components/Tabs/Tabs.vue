<script setup lang="ts">
import type { TabPaneName, TabsPaneContext } from "element-plus";
import { type Tab, tabStore } from "@/stores/tabs";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const store = tabStore();
const router = useRouter();
const activeTab = ref("");
const tabsList = computed(() => {
  return store.getTab;
});

function removeTab(targetName: TabPaneName) {
  // 检查是否是首页，如果是首页则不删除
  if (targetName === "/dashboard") {
    return;
  }
  const tabs = tabsList.value;
  let activeName = activeTab.value;
  if (activeName === targetName) {
    tabs.forEach((tab: Tab, index: number) => {
      if (tab.path === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.path;
        }
      }
    });
  }

  // 重新设置激活的选项卡
  activeTab.value = activeName;
  // 重新设置选项卡数据
  store.tabList = tabs.filter(tab => tab.path !== targetName);
  // 跳转路由
  router.push({ path: activeName });
}
const route = useRoute();
function addTab() {
  const { path, meta } = route;
  const tab: Tab = {
    path,
    title: meta.title as string,
  };

  store.addTab(tab);
}
// 添加选项卡: 监听当前路由
watch(
  () => route.path,
  () => {
    // 添加选项卡数据
    setActiveTab();
    addTab();
  },
);
function clickTab(pane: TabsPaneContext) {
  const { props } = pane;
  // 跳转路由
  router.push({ path: props.name as string });
}
// 设置激活的选项卡
function setActiveTab() {
  activeTab.value = route.path;
}
onMounted(() => {
  setActiveTab();
  addTab();
});
</script>

<template>
  <el-tabs v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" @tab-click="clickTab">
    <el-tab-pane v-for="item in tabsList" :key="item.path" :label="item.title" :name="item.path"
      :closable="item.path !== '/dashboard'" />
  </el-tabs>
</template>

<style scoped>
:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__item) {
  height: 26px !important;
  padding: 0 10px !important;
  margin: 0 3px !important;
  font-size: 12px !important;
  line-height: 26px !important;
  color: #495060;
  text-align: center !important;
  border: 1px solid #d8dce5 !important;
}

:deep(.el-tabs__nav) {
  border: none !important;
}

:deep(.el-tabs__header) {
  border: none !important;
}

:deep(.is-active) {
  color: #fff !important;
  background-color: dodgerblue !important;
  border: 1px solid dodgerblue !important;
  border-bottom: 1px solid transparent !important;
}

:deep(.el-tabs__item:hover) {
  color: #495060 !important;
}

:deep(.is-active:hover) {
  color: #fff !important;
}

:deep(.el-tabs__nav-next) {
  line-height: 26px !important;
}

:deep(.el-tabs__nav-prev) {
  line-height: 26px !important;
}
</style>
