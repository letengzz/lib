<script setup lang="ts">
import MenuItem from "./MenuItem.vue";
import MenuLogo from "./MenuLogo.vue";

import { collapseStore } from "@/stores/collapse/index.ts";
//获取store
const store = collapseStore();

//获取图标状态
const isCollapse = computed(() => {
  return store.getCollapse;
});
// 菜单列表
const menuList = reactive([
  {
    path: "/dashboard",
    component: "/dashboard/index",
    name: "dashboard",
    meta: {
      title: "首页",
      icon: "House",
      roles: ["sys:dashboard"],
    },
  },
  {
    path: "/userList",
    component: "/dashboard/index",
    name: "dashboard",
    meta: {
      title: "读者管理",
      icon: "#iconreader",
      roles: ["sys:user"],
    },
  },

  {
    path: "/system",
    component: "Layout",
    name: "system",
    meta: {
      title: "系统管理",
      icon: "Setting",
      roles: ["sys:manage"],
    },
    children: [
      {
        path: "/userList",
        component: "system/User/UserList",
        name: "userList",
        meta: {
          title: "用户管理",
          icon: "UserFilled",
          roles: ["sys:user"],
        },
      },
      {
        path: "/roleList",
        component: "system/Role/RoleList",
        name: "roleList",
        meta: {
          title: "角色管理",
          icon: "Wallet",
          roles: ["sys:role"],
        },
      },
      {
        path: "/menuList",
        component: "system/Menu/MenuList",
        name: "menuList",
        meta: {
          title: "菜单管理",
          icon: "Menu",
          roles: ["sys:menu"],
        },
      },
    ],
  },

  {
    path: "/goodsRoot",
    component: "Layout",
    name: "goodsRoot",
    meta: {
      title: "商品管理",
      icon: "#icon-mingpian",
      roles: ["sys:goodsRoot"],
    },
    children: [
      {
        path: "/category",
        component: "goods/Category",
        name: "category",
        meta: {
          title: "物资类型",
          icon: "UserFilled",
          roles: ["sys:category"],
        },
      },
      {
        path: "/goodsList",
        component: "goods/GoodsList",
        name: "goodsList",
        meta: {
          title: "商品信息",
          icon: "wallet",
          roles: ["sys:goodsList"],
        },
      },
    ],
  },
]);
// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath);
// };
// const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath);
// };
const route = useRoute();
//获取激活的菜单
const defaultActive = computed(() => {
  const { path } = route;
  return path;
});
</script>

<template>
  <MenuLogo />
  <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" :collapse="isCollapse" unique-opened
    background-color="#30333c" text-color="#f4f4f5" active-text-color="#409eff" router>
    <MenuItem :menu-list="menuList" />
  </el-menu>
</template>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  border-right: none;
}

:deep(.el-sub-menu .el-sub-menu__title) {
  color: #f4f4f5 !important;
}

:deep(.el-menu .el-menu-item) {
  color: #bfcbd9;
}

/*菜单点中文字的颜色*/
:deep(.el-menu-item.is-active) {
  color: #409eff !important;
}

/*当前打开菜单的所有子菜单颜色*/
:deep(.is-opened .el-menu-item) {
  background-color: #1f2d3d !important;
}

/*鼠标悬浮菜单颜色*/
:deep(.el-menu-item:hover) {
  background-color: #001528 !important;
}
</style>
