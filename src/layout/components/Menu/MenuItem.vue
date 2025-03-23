<script setup lang="ts">
// 通过defineProps接收父组件传递的数据
defineProps(["menuList"]);
</script>

<template>
  <template v-for="menu in menuList" :key="menu.path">
    <!-- 有子菜单 -->
    <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.path">
      <template #title>
        <i   class="el-icon" v-if="menu.meta.icon.includes('#')" >
          <svg aria-hidden="true"  width="18px" height="18px">
            <use :xlink:href="menu.meta.icon"></use>
          </svg>
        </i>
        <el-icon v-else>
          <component :is="menu.meta.icon" />
        </el-icon>
        <span>{{ menu.meta.title }}</span>
      </template>
      <MenuItem :menuList="menu.children" />
    </el-sub-menu>
    <!-- 无子菜单的一级菜单 -->
    <el-menu-item v-else :index="menu.path">
      <i   class="el-icon" v-if="menu.meta.icon.includes('#')" >
          <svg aria-hidden="true"  width="18px" height="18px">
            <use :xlink:href="menu.meta.icon"></use>
          </svg>
        </i>
        <el-icon v-else>
          <component :is="menu.meta.icon" />
        </el-icon>
      <span>{{ menu.meta.title }}</span>
    </el-menu-item>
  </template>
</template>

<style scoped lang="scss"></style>
