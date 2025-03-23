<script setup lang="ts">
import Header from "@/layout/components/Header/Header.vue";
import MenuBar from "@/layout/components/Menu/MenuBar.vue";
import CloseTabs from "@/layout/components/Tabs/CloseTabs.vue";
import Tabs from "@/layout/components/Tabs/Tabs.vue";
</script>

<template>
  <el-container class="layout-container" h="[100%]">
    <el-aside width="auto" class="leftmenu">
      <MenuBar />
    </el-aside>
    <el-container>
      <el-header class="header">
        <Header />
      </el-header>
      <el-main class="content">
        <div class="tabs">
          <Tabs class="tabs-content" />
          <CloseTabs />
        </div>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout-container {
  .header {
    display: flex;
    align-items: center;
    background-color: #f9f9f9;
  }

  .leftmenu {
    background-color: #30333c;
  }

  .content {
    padding: 0;

    .tabs {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      padding-right: 75px;
      border-bottom: 1px solid #e4e7ed;

      .el-tabs {
        width: 100%;
        height: 35px;
      }

      .tabs-content {
        padding-top: 8px;
        padding-right: 10px;
        padding-left: 10px;
      }
    }
  }
}

:deep(.el-tabs__nav > .el-tabs__item) {
  border-bottom: none !important;
}
</style>
