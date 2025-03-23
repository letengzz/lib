<script setup lang="ts">
import { type Tab, tabStore } from "@/stores/tabs";
import { Close } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";

const store = tabStore();
const router = useRouter();
const route = useRoute();

// 关闭当前
function closeCurrent() {
  const targetName = route.path;
  // 首页不能关闭
  if (targetName === "/dashboard") {
    return;
  }
  const tabs = store.getTab;
  let activeName = route.path;
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

  // 重新设置选项卡数据
  store.tabList = tabs.filter(tab => tab.path !== targetName);
  // 跳转路由
  router.push({ path: activeName });
}

// 关闭右侧
function closeRight() {
  const path = route.path;
  // 找到当前路由的索引
  const index = store.tabList.findIndex(tab => tab.path === path);
  store.tabList.splice(index + 1);
}
// 关闭左侧
function closeLeft() {
  const path = route.path;
  // 找到当前路由的索引
  const index = store.tabList.findIndex(tab => tab.path === path);
  store.tabList.splice(1, index - 1);
}
// 关闭所有
function closeAll() {
  store.tabList.splice(0, store.tabList.length);
  // 跳转首页
  router.push({ path: "/dashboard" });
}
</script>

<template>
  <div class="close">
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-icon size="20" class="el-icon--right">
          <Close />
        </el-icon>
        关闭
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="closeCurrent">
            关闭当前
          </el-dropdown-item>
          <el-dropdown-item @click="closeLeft">
            关闭左侧
          </el-dropdown-item>
          <el-dropdown-item @click="closeRight">
            关闭右侧
          </el-dropdown-item>
          <el-dropdown-item @click="closeAll">
            关闭所有
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.el-dropdown-link {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.el-dropdown-link:focus {
  outline: none;
}

.close {
  position: fixed;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 35px;
  padding-right: 10px;
  border-left: 1px solid #e4e7ed;
}
</style>
