<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <img src="@/assets/user.png" alt="头 像" h45px w45px cursor-pointer border-rd="[50%]">
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">

</script>

<style scoped>
.el-dropdown-link:focus {
  outline: none;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
