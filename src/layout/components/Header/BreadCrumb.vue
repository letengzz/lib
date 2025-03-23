<script setup lang="ts">
//定义数组用来保存数据
import { type RouteLocationMatched, useRoute } from "vue-router";
//定义数组用来保存数据
const tabs: Ref<RouteLocationMatched[]> = ref([]);
const route = useRoute();
//获取面包屑数据
const getBreadCrumb = () => {
  let matched = route.matched.filter((item) => item.meta && item.meta.title);
  //获取第一个元素
  const one = matched[0];
  //判断是否是首页
  if (one.path != "/dashboard") {
    matched = [{ path: "/dashboard", meta: { title: "首页" } } as any].concat(matched);
  }
  tabs.value = matched;
};
//监听路由变化
watch(
  () => route.path,
  () => getBreadCrumb(),
);
getBreadCrumb();
</script>

<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item v-for="item in tabs" :key="item.path">
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.breadcrumb {
  margin-left: 20px;
}

:deep(.el-breadcrumb__inner) {
  color: dodgerblue !important;
}

:deep(.el-breadcrumb__inner a) {
  color: dodgerblue !important;
}

/*修改字体大小*/
/*:deep(.el-breadcrumb__item) {
  font-size: 16px !important;
}*/
</style>
