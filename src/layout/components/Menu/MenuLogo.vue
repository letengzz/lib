<script setup lang="ts">
import MenuLogo from "@/assets/logo.svg";
import { collapseStore } from "@/stores/collapse/index";

const title = ref(import.meta.env.VITE_APP_TITLE || "图书馆管理系统");

// 获取store
const store = collapseStore();

const show = ref(true);

watch(
  () => store.getCollapse,
  (collapse: boolean) => {
    if (!collapse) {
      setTimeout(() => {
        show.value = !collapse;
      }, 300);
    }
    else {
      show.value = !collapse;
    }
  },
);
</script>

<template>
  <div class="logo" w="[100%]" h-60px flex-middle text-center lh-60px>
    <img alt="logo" class="logo-img" :src="MenuLogo" draggable="true" drag-none mx-14px h-36px w-36px>
    <div w="[100%]" flex>
      <span v-if="show" class="logo-title" pointer-events-none text-18px font-800 lh-60px>{{ title }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo {
  background: #fff;

  .logo-title {
    font-family: FangSong;
    color: dodgerblue;
  }
}
</style>
