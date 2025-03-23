<script setup lang="ts">
import Collapse from "./Collapse.vue";
import BreadCrumb from "./BreadCrumb.vue";
import LoginOut from "./LoginOut.vue";
const name = "系统管理员";
</script>

<template>
  <div class="header-container">
    <div flex-center>
      <Collapse />
      <BreadCrumb />
    </div>
    <div flex-center>
      <span mr10px style="color: dodgerblue;font-family: FangSong;">欢迎您,{{ name }}</span>
      <LoginOut />
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
