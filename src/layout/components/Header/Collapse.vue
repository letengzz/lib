<script setup lang="ts">
import { collapseStore } from "@/stores/collapse/index";
//获取store
const store = collapseStore();

//获取图标状态
const status = computed(() => {
  return store.getCollapse;
});

//点击切换
const toggleCollapse = () => {
  store.setCollapse(!store.getCollapse);
};
</script>

<template>
  <el-icon @click="toggleCollapse" class="icons" color="dodgerblue" size="30">
    <component :is="status ? 'Expand' : 'Fold'" />
  </el-icon>
</template>

<style scoped>
.icons {
  cursor: pointer;
}
</style>
