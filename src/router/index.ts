import type { App } from "vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          title: "首页",
          icon: "#icondashboard",
        },
      },
    ],
  },
  {
    path: "/system",
    component: Layout,
    name: "system",
    meta: {
      title: "系统管理",
      icon: "Setting",
      roles: ["sys:manage"],
    },
    children: [
      {
        path: "/roleList",
        component: () => import("@/views/system/Role/index.vue"),
        name: "roleList",
        meta: {
          title: "角色管理",
          icon: "wallet",
          roles: ["sys:manage"],
        },
      },
      {
        path: "/userList",
        component: () => import("@/views/system/User/index.vue"),
        name: "userList",
        meta: {
          title: "用户管理",
          icon: "UserFilled",
          roles: ["sys:user"],
        },
      },
      {
        path: "/menuList",
        component: () => import("@/views/system/Menu/index.vue"),
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
    component: Layout,
    name: "goodsRoot",
    meta: {
      title: "商品管理",
      icon: "Setting",
      roles: ["sys:goodsRoot"],
    },
    children: [
      {
        path: "/category",
        component: () => import("@/views/goods/Category/index.vue"),
        name: "category",
        meta: {
          title: "商品类型",
          icon: "UserFilled",
          roles: ["sys:category"],
        },
      },
      {
        path: "/goodsList",
        component: () => import("@/views/goods/GoodsList/index.vue"),
        name: "goodsList",
        meta: {
          title: "商品信息",
          icon: "Wallet",
          roles: ["sys:goodsList"],
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// export default router
export function useRouter(app: App) {
  app.use(router);
}
