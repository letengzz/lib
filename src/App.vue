<script setup lang="ts">
import { RouterView } from "vue-router";
import en from "element-plus/es/locale/lang/en.mjs";
import zhCn from "element-plus/es/locale/lang/zh-cn.mjs";

const language = ref("zh-cn");
const locale = computed(() => (language.value === "zh-cn" ? zhCn : en));
</script>

<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
